import { Holidays, TimeTable, Caption, BusTime, UserInput } from "../components/Types";
import { buildings, stationNames } from "@/constants/settings";

// 祝日APIへのフェッチャー
const holidaysFetcher = async (key: string) => {
    return fetch(key).then(res => res.json() as Promise<Holidays>)
}

// 時刻表APIへのフェッチャー
const timeTableFetcher = async (key: string) => {
    return fetch(key).then((res) => res.json() as Promise<TimeTable>);
}

const initializeCaption = (args: { userInput: UserInput, minutesToTime: (minutes: number) => string, isLoading: boolean,futureBuses:BusTime[],previousBuses:BusTime[]}) => {
    const {userInput,minutesToTime,isLoading,futureBuses,previousBuses}=args;
    const nextBus=futureBuses[0];
    let caption: Caption = {
        economics: "loading",
        gym: "loading",
        health: "loading",
        sport: "loading",
        departure:"loading",
        destination:"loading",
        futureBuses:futureBuses,
        previousBuses:previousBuses
    }
    if (!isLoading && nextBus) {
        if(userInput.isComingToHosei){
            caption.economics=minutesToTime(nextBus.arriveHour*60+nextBus.arriveMinute+buildings.economics);
            caption.health=minutesToTime(nextBus.arriveHour*60+nextBus.arriveMinute+buildings.health);
            caption.sport=minutesToTime(nextBus.arriveHour*60+nextBus.arriveMinute+buildings.sport);
            caption.gym=minutesToTime(nextBus.arriveHour*60+nextBus.arriveMinute+buildings.gym);
        }else{
            caption.economics="--:--";
            caption.health="--:--";
            caption.sport="--:--";
            caption.gym="--:--";
        }
        
        // for (let key in buildings) {
        //     if (userInput.isComingToHosei) {
        //         caption[key] = minutesToTime(firstBus.arriveHour * 60 + firstBus.arriveMinute + buildings[key]);
        //     } else {
        //         caption[key] = "--:--";
        //     }
        // }
        if (userInput.isComingToHosei) {
            caption.departure = stationNames[userInput.station];
            caption.destination = "法政大学"
        } else {
            caption.departure = stationNames[userInput.station];
            caption.destination = "法政大学";
        }
    }
    return caption;
}

export { holidaysFetcher, timeTableFetcher, initializeCaption }