"use client";
import { useCallback, useEffect, useMemo, useState as rerender, useState } from "react";
import useSWR from "swr";

import { Buildings, BusTime, Caption, Style } from "../app/components/Types"
import TimeCaption from "./components/TimeCaption";
import StationSwitch from "./components/StationSwitch";
import MapCaption from "./components/MapCaption";
import DiscountInformation from "./components/DiscountInformation";
import Logo from "./components/Logo";
import LinkBox from "./components/LinkBox";
import { dayIndices, findBuses, minutesToTime, } from "./features/timeHandlers";
import { buildings, holidaysAPI, GoogleForm, stationNames, timeTableAPI, Instagram, codematesHP } from "@/constants/settings";
import { initializeCaption, holidaysFetcher, timeTableFetcher } from "./features/utilities";
import GradationContainer from "./components/GradationContainer";
import Link from "next/link";


// 現在の時刻と曜日を取得

const Home = () => {
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDay = dayIndices[currentDayIndex];
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const [_, rerender] = useState([]);

  const { data: holidayData, error: holidayError, isLoading: isHolidayLoading } = useSWR(holidaysAPI, holidaysFetcher);
  let { data: timeTable, error: timeTableError, isLoading: isTimeTableLoading } = useSWR(timeTableAPI, timeTableFetcher);


  let [userInput, setUserInput] = useState({ isComingToHosei: true, station: "nishihachioji", showModal: false });
  const initializeUserInput = () => {
    if (localStorage.getItem("firstAccessed") === "false") {
      // ２回目以降のアクセスにはlocalStorageから入力を復元する
      let isComingToHosei: string | null = localStorage.getItem("isComingToHosei");
      let station: string | null = localStorage.getItem("station");
      if ("string" === typeof isComingToHosei && "string" === typeof station) {
        setUserInput({ isComingToHosei: true, station: station, showModal: false });
      } else {
        alert("localStorageのエラー");
      }
    } else {
      // 初回アクセス時にはlocalStorageに必要な値を格納する
      localStorage.setItem("firstAccessed", "false");
      localStorage.setItem("isComingToHosei", "true");
      localStorage.setItem("station", "nishihachioji");
    }
  }

  // ページ読み込み時の処理
  // https://qiita.com/iwakeniwaken/items/3c3e212599e411da54e2
  useEffect(() => {
    rerender([]);
    const interval = setInterval(() => {
      rerender([]);
    }, 1000);
    initializeUserInput();
    return () => clearInterval(interval);
  }, [])

  let caption: Caption;
  let futureBuses: BusTime[];
  let previousBuses: BusTime[];

  if (!isTimeTableLoading && !!timeTable && !isHolidayLoading && !!holidayData) {
    // 駅と方向から絞る
    timeTable = timeTable
      .filter(item => item.isComingToHosei == userInput.isComingToHosei && item.station == userInput.station)
    futureBuses = findBuses({ timeTable, holidayData, currentDay, currentHour, currentMinutes, currentDate: now, busesLength: 3 });
    previousBuses = findBuses({ timeTable, holidayData, currentDay, currentHour, currentMinutes, currentDate: now, busesLength: -3 });


  } else {
    futureBuses = []
    previousBuses = []
  }
  caption = useMemo(() => initializeCaption({ userInput, minutesToTime, futureBuses, previousBuses, isLoading: isHolidayLoading || isTimeTableLoading }),
    [futureBuses, previousBuses, userInput, isHolidayLoading, isTimeTableLoading]);
  // API取得にエラーが生じた場合エラーをコンソールに吐く
  if (timeTableError) {
    console.log(timeTableError);
  }

  const handleDirectionChange = useCallback(() => {
    if (userInput.isComingToHosei) {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei = false;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "false")
    } else {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei = true;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "true")
    }
  }, [userInput])

  const handleShowModalChange = useCallback(() => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.showModal = !nextUserInput.showModal;
    setUserInput(nextUserInput);
  }, [userInput])

  const handleStationChange = useCallback((station: string) => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.station = station;
    nextUserInput.showModal = false;
    setUserInput(nextUserInput);
    localStorage.setItem("station", station);
  }, [userInput])


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-orange-400 p-5">
      <div className="max-w-screen-sm">
        <Logo />
        <TimeCaption
          caption={caption}
          isLoading={isTimeTableLoading || isHolidayLoading}
          handleDirectionChange={handleDirectionChange}
        />
        <StationSwitch
          isLoading={isHolidayLoading || isTimeTableLoading}
          userInput={userInput}
          handleShowModalChange={handleShowModalChange}
          handleStationChange={handleStationChange}
        />
        <MapCaption
          caption={caption}
          isLoading={isTimeTableLoading || isHolidayLoading}
        />
        <DiscountInformation text="飲食店割引はこちらから" />

        <div className="flex flex-wrap justify-center w-full">
          <LinkBox><Link href={GoogleForm}>アプリご意見</Link></LinkBox>
          <LinkBox><button onClick={async () => {
            try {
              await navigator.share({
                title: "たまっぷ!(Next.js)",
                text: codematesHP.concat("tamap/")
              });
            } catch (error) {
              console.log("Error sharing:", error);
            }
          }}>アプリを共有</button></LinkBox>
          <LinkBox><Link href={codematesHP}>CODE MATESとは</Link></LinkBox>
          <LinkBox><Link href={Instagram}>Instagram</Link></LinkBox>
        </div>
        <p className="text-xs text-center">時刻は目安であり、交通状況等によって変わる可能性があります。また臨時便等には対応しておりません。</p>
        <p className="flex justify-center items-center text-center text-lg">©CODE MATES︎</p>
      </div>
    </div>
  );
}

export default Home;