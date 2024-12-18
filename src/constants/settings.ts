import { Buildings, StationNames } from "@/app/components/Types";

const timeOfEquation=9
const timeTableAPI = "/api/timetable";
const holidaysAPI = "https://holidays-jp.github.io/api/v1/date.json"
const GoogleForm = "https://docs.google.com/forms/d/17Le4TKOCQyZleSlCIYQmPKOnAgT80iTY6W4h2aON1_Y/viewform?edit_requested=true";
const Instagram="https://www.instagram.com/codemates_hosei/"
const codematesHP="https://codemates123.github.io/homepage/"
const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };
const buildings: Buildings = {
    economics: 5,
    health: 4,
    sport: 8,
    gym: 15,
  };


export {timeTableAPI,holidaysAPI,GoogleForm,stationNames,buildings,Instagram,codematesHP,timeOfEquation}