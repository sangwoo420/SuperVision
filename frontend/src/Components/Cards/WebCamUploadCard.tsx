import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { VideoHTMLAttributes, useEffect, useRef, ChangeEvent, useState } from "react";
import "./WebCamUploadCard.css";

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
};

const Video = ({ srcObject, ...props }: PropsType) => {
  const refVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);
  console.log(refVideo);
  return <video className="webcam-video" ref={refVideo} {...props} autoPlay />;
};

const CustomSwitch = styled((props: SwitchProps) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 22,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(17px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#5F7B84",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 19,
      height: 19,
    },
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#5F7B84",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

const WebCamUploadDiv = styled("div")({
  width: "320px",
  height: "240px",
  borderRadius: "20px",
  border: "1.5px dashed #F2FFFF",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const WebCamUploadCanvas = styled("canvas")({
  width: "320px",
  height: "240px",
});

const TitleSpan = styled("span")({
  color: "#CEF3FF",
  fontSize: "2rem",
  fontWeight: "600",
  padding: "5px",
});

type WebCamUploadCardProp = {
  videoSrc: MediaStream | null | undefined;
  toggleWebcam: Function;
};

function WebCamUploadCardTmp({ videoSrc = null, toggleWebcam }: WebCamUploadCardProp) {
  const [webcamOn, setWebcamOn] = useState<boolean>(videoSrc ? true : false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const video = document.createElement("video");
  video.autoplay = true;
  const refVideo = useRef<HTMLVideoElement>(video);
  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = videoSrc;
    console.log(refVideo);
  }, [videoSrc]);

  useEffect(() => {
    if (!webcamOn) return;
    const timer = setInterval(drawImg, 1000 / 15);
    return () => {
      clearInterval(timer);
    };
  }, [webcamOn]);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setWebcamOn(prev => !prev)
    if (e.target.checked) {
      setWebcamOn(await toggleWebcam(true));
    } else {
      setWebcamOn(await toggleWebcam(false));
    }
  };

  const readImg = () => {
    let canvasImg: string | undefined = canvasRef.current?.toDataURL("image/jpeg", 1);

    let decodedImg: string = canvasImg !== undefined ? atob(canvasImg?.split(",")[1]) : "";
    let arr = [];
    for (let i = 0; i < decodedImg.length; i++) {
      arr.push(decodedImg.charCodeAt(i));
    }
    let img = new Blob([new Uint8Array(arr)], { type: "image/jpeg" });

    // 소켓으로 보내기
  };

  const drawImg = () => {
    const ctx = canvasRef.current?.getContext("2d");
    console.log(refVideo.current);
    ctx?.drawImage(refVideo.current, 0, 0, 320, 240);
  };

  return (
    <div className="card-container">
      <TitleSpan>ORIGINAL</TitleSpan>
      <FormControlLabel
        control={<CustomSwitch sx={{ m: 1 }} onChange={onChange} checked={webcamOn} />}
        label={`웹캠 ${webcamOn ? "On" : "Off"}`}
        labelPlacement="start"
      />

      <WebCamUploadDiv>
        {videoSrc ? (
          <>
            <WebCamUploadCanvas ref={canvasRef} height="240" width="320"></WebCamUploadCanvas>
          </>
        ) : (
          <>
            <VideocamOutlinedIcon sx={{ color: "#5F7B84", fontSize: 50 }} />
            <span>웹캠을 켜주세요</span>
          </>
        )}
      </WebCamUploadDiv>
    </div>
  );
}

export default WebCamUploadCardTmp;
