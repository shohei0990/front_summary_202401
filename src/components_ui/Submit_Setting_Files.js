import axios from "axios";
import React, { useState, useContext } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Text, Center, Collapse, Flex } from "@chakra-ui/react";

// App.js での各種の状態変数を共用
import {
  Mycontext,
  root,
  Pathcontext,
  Videocontext,
  Transcriptcontext,
  TxtContext,
  Precisioncontext,
} from "../App";
// 各コンポーネントを呼び出し
import FileUploadArea from "./FileUploadArea"; // 20231129 追加
import SliderAccuracy from "./SliderAccuracy";
import DL from "../components/DLfirebase";
import CustomRadioGroup from "./CustomRadioGroup";
import FormDetails from "./FormDetails";
import { getCurrentUser } from "../components/firebaseUtils"; // 20230923 追加
import {
  formButtonStyle,
  textStyle,
  formTextStyle,
  submitButtonStyle,
} from "./styles"; // スタイルをインポート

function Submit_Setting_Files() {
  // Contexts and State Hooks
  const url = useContext(root);
  const [setting_filename, setSettingfilename] = useContext(Mycontext);
  const [precision, setPrecision] = useContext(Precisioncontext);
  const [resultpath, setResultpath] = useContext(Pathcontext);
  const [videolength] = useContext(Videocontext);
  const [transcriptiontime] = useContext(Transcriptcontext);
  const [txt] = useContext(TxtContext);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [sliderValue, setSliderValue] = useState(0); //書き起こし精度
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const currentUser = getCurrentUser();
  const [isOpenBaseInfo, setIsOpenBaseInfo] = useState(false);
  const id = currentUser.id;
  const [fileType, setFileType] = useState(null);
  const toggleCollapse = () => {
    setIsOpenBaseInfo(!isOpenBaseInfo);
  };

  // 条件分岐ページ用
  const [hasStartedTranscription, setHasStartedTranscription] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  // ファイルのポストとファイルネーム作成、APIのpostパスの作成
  const post_setting_file = async (event) => {
    event.preventDefault();
    const data = {
      title: title,
      date: date,
      participants: members,
      purpose: purpose,
      precision: precision,
    };
    try {
      const response = await axios.post(url + "settings/" + id, data);
      console.log("filename:", response);
      setSettingfilename(response.data);
      setHasStartedTranscription(true); // すぐに画面遷移させる
      post_file(response.data, selectedValue); // バックグラウンドで非同期処理を行う
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  //テキストファイルと動画ファイルのアップロード
  const post_file = async (st_filename, selectedValue) => {
    console.log("setting_filename:", st_filename);
    const URL_getfilename = url + "get_filename/" + st_filename;
    const URL_upload =
      url + "uploadfile/" + id + "/" + selectedValue + "/" + st_filename;

    const Submit = async () => {
      const formdata = new FormData(); //
      formdata.append("upload_file", txt);

      const response_name = await axios.post(URL_getfilename, formdata); //ファイル名の取得?
      setResultpath(response_name.data);

      console.log(URL_upload);
      const response = await axios.post(URL_upload, formdata, {
        timeout: 600000,
      });
      setTranscription(response.data.transcription);
      setSummary(response.data.summary);
    };

    try {
      await Submit();
      alert("要約が完了しました");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // アップロードファイルのvideo判定
  const handleFileSelected = (file) => {
    if (file.type.startsWith("video/")) {
      setFileType("video");
    } else {
      setFileType("other");
    }
  };

  return (
    <div>
      <Flex direction="column" width="100%" paddingTop="20px">
        {hasStartedTranscription ? (
          // 3. hasStartedTranscriptionがtrueの場合の表示
          <>
            <DL />
            <Center mt="5">
              {/* 1. 戻るボタンの追加 */}
              <Button
                {...formButtonStyle}
                onClick={() => setHasStartedTranscription(false)} // 2. 戻るボタンをクリックしたらhasStartedTranscriptionをfalseに
              >
                戻る
              </Button>
            </Center>
          </>
        ) : (
          // 3. hasStartedTranscriptionがfalseの場合の表示
          <>
            <Text {...textStyle}>ファイルのアップロード</Text>

            <form onSubmit={post_setting_file}>
              <FileUploadArea onFileSelected={handleFileSelected} />

              {fileType === "video" && (
                <>
                  {/* 書き起こし精度の設定 */}
                  <Text fontSize="xl" color="#6FA2DF" mt="8">
                    文字おこしの精度
                  </Text>
                  <SliderAccuracy
                    sliderValue={sliderValue}
                    setSliderValue={setSliderValue}
                  />
                </>
              )}

              {/* 議事録フォーマットの選択 */}
              <Text mt="10" mb="2" {...textStyle}>
                議事録フォーマットの選択
              </Text>
              <CustomRadioGroup value={selectedValue} onChange={handleChange} />

              {/* 基本情報の記入 */}
              <Button
                onClick={toggleCollapse}
                leftIcon={<ChevronDownIcon boxSize="8" color="#6FA2DF" />}
                px="0"
                pr="3"
                pl="0"
                mx="0"
                mt="3"
                backgroundColor="white"
                fontWeight="thin"
              >
                <Text {...formTextStyle}>基本情報の記入</Text>
              </Button>

              <Collapse in={isOpenBaseInfo}>
                <FormDetails
                  title={title}
                  setTitle={setTitle}
                  date={date}
                  setDate={setDate}
                  members={members}
                  setMembers={setMembers}
                  purpose={purpose}
                  setPurpose={setPurpose}
                />
              </Collapse>

              {/* 文字起こし開始ボタン処理 */}
              <Center mt="5">
                <Button {...submitButtonStyle} type="submit">
                  文字起こし・要約スタート
                </Button>
              </Center>
            </form>
          </>
        )}
      </Flex>
    </div>
  );
}

export default Submit_Setting_Files;
