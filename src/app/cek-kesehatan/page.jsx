"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiHeartPulseLine, RiArrowRightLine, RiArrowLeftLine, RiCheckLine, RiCloseLine,
  RiAlertLine, RiInformationLine, RiShieldCheckLine, RiUserLine, RiScales3Line,
  RiRulerLine, RiCalendarLine, RiHospitalLine, RiHomeLine, RiRefreshLine,
  RiDropLine, RiSunLine, RiMedicineBottleLine, RiParentLine, RiHeartLine,
  RiFirstAidKitLine, RiThermometerLine, RiMusicLine, RiSeedlingLine, RiNurseLine,
  RiErrorWarningLine, RiStethoscopeLine, RiBodyScanLine,
} from "react-icons/ri";

// ─── WHO GROWTH TABLES [index, -3SD, -2SD, +2SD, +3SD] ──────────────────────
// BB/U (Weight-for-Age), monthly 0–60 months
const WHO_BBU_BOYS = [
  [0,2.1,2.5,4.4,5.0],
  [1,2.9,3.4,5.8,6.6],
  [2,3.8,4.3,7.1,8.0],
  [3,4.4,5.0,8.0,9.0],
  [4,4.9,5.6,8.7,9.7],
  [5,5.3,6.0,9.3,10.4],
  [6,5.7,6.4,9.8,10.9],
  [7,5.9,6.7,10.3,11.4],
  [8,6.2,6.9,10.7,11.9],
  [9,6.4,7.1,11.0,12.3],
  [10,6.6,7.4,11.4,12.7],
  [11,6.8,7.6,11.7,13.0],
  [12,6.9,7.7,12.0,13.3],
  [13,7.1,7.9,12.3,13.7],
  [14,7.2,8.1,12.6,14.0],
  [15,7.4,8.3,12.8,14.3],
  [16,7.5,8.4,13.1,14.6],
  [17,7.7,8.6,13.4,14.9],
  [18,7.8,8.8,13.7,15.3],
  [19,8.0,8.9,13.9,15.6],
  [20,8.1,9.1,14.2,15.9],
  [21,8.2,9.2,14.5,16.2],
  [22,8.4,9.4,14.7,16.5],
  [23,8.5,9.5,15.0,16.8],
  [24,8.6,9.7,15.3,17.1],
  [25,8.8,9.8,15.5,17.5],
  [26,8.9,10.0,15.8,17.8],
  [27,9.0,10.1,16.1,18.1],
  [28,9.1,10.2,16.3,18.4],
  [29,9.2,10.4,16.6,18.7],
  [30,9.4,10.5,16.9,19.0],
  [31,9.5,10.7,17.1,19.3],
  [32,9.6,10.8,17.4,19.6],
  [33,9.7,10.9,17.6,19.9],
  [34,9.8,11.0,17.8,20.2],
  [35,9.9,11.2,18.1,20.4],
  [36,10.0,11.3,18.3,20.7],
  [37,10.1,11.4,18.6,21.0],
  [38,10.2,11.5,18.8,21.3],
  [39,10.3,11.6,19.0,21.6],
  [40,10.4,11.8,19.3,21.9],
  [41,10.5,11.9,19.5,22.1],
  [42,10.6,12.0,19.7,22.4],
  [43,10.7,12.1,20.0,22.7],
  [44,10.8,12.2,20.2,23.0],
  [45,10.9,12.4,20.5,23.3],
  [46,11.0,12.5,20.7,23.6],
  [47,11.1,12.6,20.9,23.9],
  [48,11.2,12.7,21.2,24.2],
  [49,11.3,12.8,21.4,24.5],
  [50,11.4,12.9,21.7,24.8],
  [51,11.5,13.1,21.9,25.1],
  [52,11.6,13.2,22.2,25.4],
  [53,11.7,13.3,22.4,25.7],
  [54,11.8,13.4,22.7,26.0],
  [55,11.9,13.5,22.9,26.3],
  [56,12.0,13.6,23.2,26.6],
  [57,12.1,13.7,23.4,26.9],
  [58,12.2,13.8,23.7,27.2],
  [59,12.3,14.0,23.9,27.6],
  [60,12.4,14.1,24.2,27.9]
];
const WHO_BBU_GIRLS = [
  [0,2.0,2.4,4.2,4.8],
  [1,2.7,3.2,5.5,6.2],
  [2,3.4,3.9,6.6,7.5],
  [3,4.0,4.5,7.5,8.5],
  [4,4.4,5.0,8.2,9.3],
  [5,4.8,5.4,8.8,10.0],
  [6,5.1,5.7,9.3,10.6],
  [7,5.3,6.0,9.8,11.1],
  [8,5.6,6.3,10.2,11.6],
  [9,5.8,6.5,10.5,12.0],
  [10,5.9,6.7,10.9,12.4],
  [11,6.1,6.9,11.2,12.8],
  [12,6.3,7.0,11.5,13.1],
  [13,6.4,7.2,11.8,13.5],
  [14,6.6,7.4,12.1,13.8],
  [15,6.7,7.6,12.4,14.1],
  [16,6.9,7.7,12.6,14.5],
  [17,7.0,7.9,12.9,14.8],
  [18,7.2,8.1,13.2,15.1],
  [19,7.3,8.2,13.5,15.4],
  [20,7.5,8.4,13.7,15.7],
  [21,7.6,8.6,14.0,16.0],
  [22,7.8,8.7,14.3,16.4],
  [23,7.9,8.9,14.6,16.7],
  [24,8.1,9.0,14.8,17.0],
  [25,8.2,9.2,15.1,17.3],
  [26,8.4,9.4,15.4,17.7],
  [27,8.5,9.5,15.7,18.0],
  [28,8.6,9.7,16.0,18.3],
  [29,8.8,9.8,16.2,18.7],
  [30,8.9,10.0,16.5,19.0],
  [31,9.0,10.1,16.8,19.3],
  [32,9.1,10.3,17.1,19.6],
  [33,9.3,10.4,17.3,20.0],
  [34,9.4,10.5,17.6,20.3],
  [35,9.5,10.7,17.9,20.6],
  [36,9.6,10.8,18.1,20.9],
  [37,9.7,10.9,18.4,21.3],
  [38,9.8,11.1,18.7,21.6],
  [39,9.9,11.2,19.0,22.0],
  [40,10.1,11.3,19.2,22.3],
  [41,10.2,11.5,19.5,22.7],
  [42,10.3,11.6,19.8,23.0],
  [43,10.4,11.7,20.1,23.4],
  [44,10.5,11.8,20.4,23.7],
  [45,10.6,12.0,20.7,24.1],
  [46,10.7,12.1,20.9,24.5],
  [47,10.8,12.2,21.2,24.8],
  [48,10.9,12.3,21.5,25.2],
  [49,11.0,12.4,21.8,25.5],
  [50,11.1,12.6,22.1,25.9],
  [51,11.2,12.7,22.4,26.3],
  [52,11.3,12.8,22.6,26.6],
  [53,11.4,12.9,22.9,27.0],
  [54,11.5,13.0,23.2,27.4],
  [55,11.6,13.2,23.5,27.7],
  [56,11.7,13.3,23.8,28.1],
  [57,11.8,13.4,24.1,28.5],
  [58,11.9,13.5,24.4,28.8],
  [59,12.0,13.6,24.6,29.2],
  [60,12.1,13.7,24.9,29.5]
];
// TB/U (Length/Height-for-Age), monthly 0–60 months
const WHO_TBU_BOYS = [
  [0,1.8931,44.2,46.1,53.7],
  [1,1.9465,48.9,50.8,58.6],
  [2,2.0005,52.4,54.4,62.4],
  [3,2.0444,55.3,57.3,65.5],
  [4,2.0808,57.6,59.7,68.0],
  [5,2.1115,59.6,61.7,70.1],
  [6,2.1403,61.2,63.3,71.9],
  [7,2.1711,62.7,64.8,73.5],
  [8,2.2055,64.0,66.2,75.0],
  [9,2.2433,65.2,67.5,76.5],
  [10,2.2849,66.4,68.7,77.9],
  [11,2.3293,67.6,69.9,79.2],
  [12,2.3762,68.6,71.0,80.5],
  [13,2.426,69.6,72.1,81.8],
  [14,2.4773,70.6,73.1,83.0],
  [15,2.5303,71.6,74.1,84.2],
  [16,2.5844,72.5,75.0,85.4],
  [17,2.6406,73.3,76.0,86.5],
  [18,2.6973,74.2,76.9,87.7],
  [19,2.7553,75.0,77.7,88.8],
  [20,2.814,75.8,78.6,89.8],
  [21,2.8742,76.5,79.4,90.9],
  [22,2.9342,77.2,80.2,91.9],
  [23,2.9951,78.0,81.0,92.9],
  [24,3.0551,78.0,81.0,93.2],
  [25,3.116,78.6,81.7,94.2],
  [26,3.1757,79.3,82.5,95.2],
  [27,3.2353,79.9,83.1,96.1],
  [28,3.2928,80.5,83.8,97.0],
  [29,3.3501,81.1,84.5,97.9],
  [30,3.4052,81.7,85.1,98.7],
  [31,3.4591,82.3,85.7,99.6],
  [32,3.5118,82.8,86.4,100.4],
  [33,3.5625,83.4,86.9,101.2],
  [34,3.612,83.9,87.5,102.0],
  [35,3.6604,84.4,88.1,102.7],
  [36,3.7069,85.0,88.7,103.5],
  [37,3.7523,85.5,89.2,104.2],
  [38,3.7976,86.0,89.8,105.0],
  [39,3.8409,86.5,90.3,105.7],
  [40,3.8831,87.0,90.9,106.4],
  [41,3.9242,87.5,91.4,107.1],
  [42,3.9651,88.0,91.9,107.8],
  [43,4.0039,88.4,92.4,108.5],
  [44,4.0435,88.9,93.0,109.1],
  [45,4.081,89.4,93.5,109.8],
  [46,4.1194,89.8,94.0,110.4],
  [47,4.1567,90.3,94.4,111.1],
  [48,4.1941,90.7,94.9,111.7],
  [49,4.2314,91.2,95.4,112.4],
  [50,4.2677,91.6,95.9,113.0],
  [51,4.3052,92.1,96.4,113.6],
  [52,4.3417,92.5,96.9,114.2],
  [53,4.3783,93.0,97.4,114.9],
  [54,4.4149,93.4,97.8,115.5],
  [55,4.4517,93.9,98.3,116.1],
  [56,4.4886,94.3,98.8,116.7],
  [57,4.5245,94.7,99.3,117.4],
  [58,4.5616,95.2,99.7,118.0],
  [59,4.5977,95.6,100.2,118.6],
  [60,4.6339,96.1,100.7,119.2]
];
const WHO_TBU_GIRLS = [
  [0,1.8627,43.6,45.4,52.9],
  [1,1.9542,47.8,49.8,57.6],
  [2,2.0362,51.0,53.0,61.1],
  [3,2.1051,53.5,55.6,64.0],
  [4,2.1645,55.6,57.8,66.4],
  [5,2.2174,57.4,59.6,68.5],
  [6,2.2664,58.9,61.2,70.3],
  [7,2.3154,60.3,62.7,71.9],
  [8,2.365,61.7,64.0,73.5],
  [9,2.4157,62.9,65.3,75.0],
  [10,2.4676,64.1,66.5,76.4],
  [11,2.5208,65.2,67.7,77.8],
  [12,2.575,66.3,68.9,79.2],
  [13,2.6296,67.3,70.0,80.5],
  [14,2.6841,68.3,71.0,81.7],
  [15,2.7392,69.3,72.0,83.0],
  [16,2.7944,70.2,73.0,84.2],
  [17,2.849,71.1,74.0,85.4],
  [18,2.9039,72.0,74.9,86.5],
  [19,2.9582,72.8,75.8,87.6],
  [20,3.0129,73.7,76.7,88.7],
  [21,3.0672,74.5,77.5,89.8],
  [22,3.1202,75.2,78.4,90.8],
  [23,3.1737,76.0,79.2,91.9],
  [24,3.2267,76.0,79.3,92.2],
  [25,3.2783,76.8,80.0,93.1],
  [26,3.33,77.5,80.8,94.1],
  [27,3.3812,78.1,81.5,95.0],
  [28,3.4313,78.8,82.2,96.0],
  [29,3.4809,79.5,82.9,96.9],
  [30,3.5302,80.1,83.6,97.7],
  [31,3.5782,80.7,84.3,98.6],
  [32,3.6259,81.3,84.9,99.4],
  [33,3.6724,81.9,85.6,100.3],
  [34,3.7186,82.5,86.2,101.1],
  [35,3.7638,83.1,86.8,101.9],
  [36,3.8078,83.6,87.4,102.7],
  [37,3.8526,84.2,88.0,103.4],
  [38,3.8963,84.7,88.6,104.2],
  [39,3.9389,85.3,89.2,105.0],
  [40,3.9813,85.8,89.8,105.7],
  [41,4.0236,86.3,90.4,106.4],
  [42,4.0658,86.8,90.9,107.2],
  [43,4.1068,87.4,91.5,107.9],
  [44,4.1476,87.9,92.0,108.6],
  [45,4.1883,88.4,92.5,109.3],
  [46,4.2279,88.9,93.1,110.0],
  [47,4.2683,89.3,93.6,110.7],
  [48,4.3075,89.8,94.1,111.3],
  [49,4.3456,90.3,94.6,112.0],
  [50,4.3847,90.7,95.1,112.7],
  [51,4.4226,91.2,95.6,113.3],
  [52,4.4604,91.7,96.1,114.0],
  [53,4.4981,92.1,96.6,114.6],
  [54,4.5358,92.6,97.1,115.2],
  [55,4.5734,93.0,97.6,115.9],
  [56,4.6108,93.4,98.1,116.5],
  [57,4.6472,93.9,98.5,117.1],
  [58,4.6834,94.3,99.0,117.7],
  [59,4.7195,94.7,99.5,118.3],
  [60,4.7566,95.2,99.9,118.9]
];
// BB/TB (Weight-for-Height), per 0.5cm increments
const WHO_BBTB_BOYS = [
  [45.0,1.9,2.0,3.0,3.3],
  [45.5,1.9,2.1,3.1,3.4],
  [46.0,2.0,2.2,3.1,3.5],
  [46.5,2.1,2.3,3.2,3.6],
  [47.0,2.1,2.3,3.3,3.7],
  [47.5,2.2,2.4,3.4,3.8],
  [48.0,2.3,2.5,3.6,3.9],
  [48.5,2.3,2.6,3.7,4.0],
  [49.0,2.4,2.6,3.8,4.2],
  [49.5,2.5,2.7,3.9,4.3],
  [50.0,2.6,2.8,4.0,4.4],
  [50.5,2.7,2.9,4.1,4.5],
  [51.0,2.7,3.0,4.2,4.7],
  [51.5,2.8,3.1,4.4,4.8],
  [52.0,2.9,3.2,4.5,5.0],
  [52.5,3.0,3.3,4.6,5.1],
  [53.0,3.1,3.4,4.8,5.3],
  [53.5,3.2,3.5,4.9,5.4],
  [54.0,3.3,3.6,5.1,5.6],
  [54.5,3.4,3.7,5.3,5.8],
  [55.0,3.6,3.8,5.4,6.0],
  [55.5,3.7,4.0,5.6,6.1],
  [56.0,3.8,4.1,5.8,6.3],
  [56.5,3.9,4.2,5.9,6.5],
  [57.0,4.0,4.3,6.1,6.7],
  [57.5,4.1,4.5,6.3,6.9],
  [58.0,4.3,4.6,6.4,7.1],
  [58.5,4.4,4.7,6.6,7.2],
  [59.0,4.5,4.8,6.8,7.4],
  [59.5,4.6,5.0,7.0,7.6],
  [60.0,4.7,5.1,7.1,7.8],
  [60.5,4.8,5.2,7.3,8.0],
  [61.0,4.9,5.3,7.4,8.1],
  [61.5,5.0,5.4,7.6,8.3],
  [62.0,5.1,5.6,7.7,8.5],
  [62.5,5.2,5.7,7.9,8.6],
  [63.0,5.3,5.8,8.0,8.8],
  [63.5,5.4,5.9,8.2,8.9],
  [64.0,5.5,6.0,8.3,9.1],
  [64.5,5.6,6.1,8.5,9.3],
  [65.0,5.9,6.3,8.8,9.6],
  [65.5,6.0,6.4,8.9,9.8],
  [66.0,6.1,6.5,9.1,9.9],
  [66.5,6.1,6.6,9.2,10.1],
  [67.0,6.2,6.7,9.4,10.2],
  [67.5,6.3,6.8,9.5,10.4],
  [68.0,6.4,6.9,9.6,10.5],
  [68.5,6.5,7.0,9.8,10.7],
  [69.0,6.6,7.1,9.9,10.8],
  [69.5,6.7,7.2,10.0,11.0],
  [70.0,6.8,7.3,10.2,11.1],
  [70.5,6.9,7.4,10.3,11.3],
  [71.0,6.9,7.5,10.4,11.4],
  [71.5,7.0,7.6,10.6,11.6],
  [72.0,7.1,7.7,10.7,11.7],
  [72.5,7.2,7.8,10.8,11.8],
  [73.0,7.3,7.9,11.0,12.0],
  [73.5,7.4,7.9,11.1,12.1],
  [74.0,7.4,8.0,11.2,12.2],
  [74.5,7.5,8.1,11.3,12.4],
  [75.0,7.6,8.2,11.4,12.5],
  [75.5,7.7,8.3,11.6,12.6],
  [76.0,7.7,8.4,11.7,12.8],
  [76.5,7.8,8.5,11.8,12.9],
  [77.0,7.9,8.5,11.9,13.0],
  [77.5,8.0,8.6,12.0,13.1],
  [78.0,8.0,8.7,12.1,13.3],
  [78.5,8.1,8.8,12.2,13.4],
  [79.0,8.2,8.8,12.3,13.5],
  [79.5,8.3,8.9,12.4,13.6],
  [80.0,8.3,9.0,12.6,13.7],
  [80.5,8.4,9.1,12.7,13.8],
  [81.0,8.5,9.2,12.8,14.0],
  [81.5,8.6,9.3,12.9,14.1],
  [82.0,8.7,9.3,13.0,14.2],
  [82.5,8.7,9.4,13.1,14.4],
  [83.0,8.8,9.5,13.3,14.5],
  [83.5,8.9,9.6,13.4,14.6],
  [84.0,9.0,9.7,13.5,14.8],
  [84.5,9.1,9.9,13.7,14.9],
  [85.0,9.2,10.0,13.8,15.1],
  [85.5,9.3,10.1,13.9,15.2],
  [86.0,9.4,10.2,14.1,15.4],
  [86.5,9.5,10.3,14.2,15.5],
  [87.0,9.6,10.4,14.4,15.7],
  [87.5,9.7,10.5,14.5,15.8],
  [88.0,9.8,10.6,14.7,16.0],
  [88.5,9.9,10.7,14.8,16.1],
  [89.0,10.0,10.8,14.9,16.3],
  [89.5,10.1,10.9,15.1,16.4],
  [90.0,10.2,11.0,15.2,16.6],
  [90.5,10.3,11.1,15.3,16.7],
  [91.0,10.4,11.2,15.5,16.9],
  [91.5,10.5,11.3,15.6,17.0],
  [92.0,10.6,11.4,15.8,17.2],
  [92.5,10.7,11.5,15.9,17.3],
  [93.0,10.8,11.6,16.0,17.5],
  [93.5,10.9,11.7,16.2,17.6],
  [94.0,11.0,11.8,16.3,17.8],
  [94.5,11.1,11.9,16.5,17.9],
  [95.0,11.1,12.0,16.6,18.1],
  [95.5,11.2,12.1,16.7,18.3],
  [96.0,11.3,12.2,16.9,18.4],
  [96.5,11.4,12.3,17.0,18.6],
  [97.0,11.5,12.4,17.2,18.8],
  [97.5,11.6,12.5,17.4,18.9],
  [98.0,11.7,12.6,17.5,19.1],
  [98.5,11.8,12.8,17.7,19.3],
  [99.0,11.9,12.9,17.9,19.5],
  [99.5,12.0,13.0,18.0,19.7],
  [100.0,12.1,13.1,18.2,19.9],
  [100.5,12.2,13.2,18.4,20.1],
  [101.0,12.3,13.3,18.5,20.3],
  [101.5,12.4,13.4,18.7,20.5],
  [102.0,12.5,13.6,18.9,20.7],
  [102.5,12.6,13.7,19.1,20.9],
  [103.0,12.8,13.8,19.3,21.1],
  [103.5,12.9,13.9,19.5,21.3],
  [104.0,13.0,14.0,19.7,21.6],
  [104.5,13.1,14.2,19.9,21.8],
  [105.0,13.2,14.3,20.1,22.0],
  [105.5,13.3,14.4,20.3,22.2],
  [106.0,13.4,14.5,20.5,22.5],
  [106.5,13.5,14.7,20.7,22.7],
  [107.0,13.7,14.8,20.9,22.9],
  [107.5,13.8,14.9,21.1,23.2],
  [108.0,13.9,15.1,21.3,23.4],
  [108.5,14.0,15.2,21.5,23.7],
  [109.0,14.1,15.3,21.8,23.9],
  [109.5,14.3,15.5,22.0,24.2],
  [110.0,14.4,15.6,22.2,24.4],
  [110.5,14.5,15.8,22.4,24.7],
  [111.0,14.6,15.9,22.7,25.0],
  [111.5,14.8,16.0,22.9,25.2],
  [112.0,14.9,16.2,23.1,25.5],
  [112.5,15.0,16.3,23.4,25.8],
  [113.0,15.2,16.5,23.6,26.0],
  [113.5,15.3,16.6,23.9,26.3],
  [114.0,15.4,16.8,24.1,26.6],
  [114.5,15.6,16.9,24.4,26.9],
  [115.0,15.7,17.1,24.6,27.2],
  [115.5,15.8,17.2,24.9,27.5],
  [116.0,16.0,17.4,25.1,27.8],
  [116.5,16.1,17.5,25.4,28.0],
  [117.0,16.2,17.7,25.6,28.3],
  [117.5,16.4,17.9,25.9,28.6],
  [118.0,16.5,18.0,26.1,28.9],
  [118.5,16.7,18.2,26.4,29.2],
  [119.0,16.8,18.3,26.6,29.5],
  [119.5,16.9,18.5,26.9,29.8],
  [120.0,17.1,18.6,27.2,30.1]
];
const WHO_BBTB_GIRLS = [
  [45.0,1.9,2.1,3.0,3.3],
  [45.5,2.0,2.1,3.1,3.4],
  [46.0,2.0,2.2,3.2,3.5],
  [46.5,2.1,2.3,3.3,3.6],
  [47.0,2.2,2.4,3.4,3.7],
  [47.5,2.2,2.4,3.5,3.8],
  [48.0,2.3,2.5,3.6,4.0],
  [48.5,2.4,2.6,3.7,4.1],
  [49.0,2.4,2.6,3.8,4.2],
  [49.5,2.5,2.7,3.9,4.3],
  [50.0,2.6,2.8,4.0,4.5],
  [50.5,2.7,2.9,4.2,4.6],
  [51.0,2.8,3.0,4.3,4.8],
  [51.5,2.8,3.1,4.4,4.9],
  [52.0,2.9,3.2,4.6,5.1],
  [52.5,3.0,3.3,4.7,5.2],
  [53.0,3.1,3.4,4.9,5.4],
  [53.5,3.2,3.5,5.0,5.5],
  [54.0,3.3,3.6,5.2,5.7],
  [54.5,3.4,3.7,5.3,5.9],
  [55.0,3.5,3.8,5.5,6.1],
  [55.5,3.6,3.9,5.7,6.3],
  [56.0,3.7,4.0,5.8,6.4],
  [56.5,3.8,4.1,6.0,6.6],
  [57.0,3.9,4.3,6.1,6.8],
  [57.5,4.0,4.4,6.3,7.0],
  [58.0,4.1,4.5,6.5,7.1],
  [58.5,4.2,4.6,6.6,7.3],
  [59.0,4.3,4.7,6.8,7.5],
  [59.5,4.4,4.8,6.9,7.7],
  [60.0,4.5,4.9,7.1,7.8],
  [60.5,4.6,5.0,7.3,8.0],
  [61.0,4.7,5.1,7.4,8.2],
  [61.5,4.8,5.2,7.6,8.4],
  [62.0,4.9,5.3,7.7,8.5],
  [62.5,5.0,5.4,7.8,8.7],
  [63.0,5.1,5.5,8.0,8.8],
  [63.5,5.2,5.6,8.1,9.0],
  [64.0,5.3,5.7,8.3,9.1],
  [64.5,5.4,5.8,8.4,9.3],
  [65.0,5.6,6.1,8.7,9.7],
  [65.5,5.7,6.2,8.9,9.8],
  [66.0,5.8,6.3,9.0,10.0],
  [66.5,5.8,6.4,9.1,10.1],
  [67.0,5.9,6.4,9.3,10.2],
  [67.5,6.0,6.5,9.4,10.4],
  [68.0,6.1,6.6,9.5,10.5],
  [68.5,6.2,6.7,9.7,10.7],
  [69.0,6.3,6.8,9.8,10.8],
  [69.5,6.3,6.9,9.9,10.9],
  [70.0,6.4,7.0,10.0,11.1],
  [70.5,6.5,7.1,10.1,11.2],
  [71.0,6.6,7.1,10.3,11.3],
  [71.5,6.7,7.2,10.4,11.5],
  [72.0,6.7,7.3,10.5,11.6],
  [72.5,6.8,7.4,10.6,11.7],
  [73.0,6.9,7.5,10.7,11.8],
  [73.5,7.0,7.6,10.8,12.0],
  [74.0,7.0,7.6,11.0,12.1],
  [74.5,7.1,7.7,11.1,12.2],
  [75.0,7.2,7.8,11.2,12.3],
  [75.5,7.2,7.9,11.3,12.5],
  [76.0,7.3,8.0,11.4,12.6],
  [76.5,7.4,8.0,11.5,12.7],
  [77.0,7.5,8.1,11.6,12.8],
  [77.5,7.5,8.2,11.7,12.9],
  [78.0,7.6,8.3,11.8,13.1],
  [78.5,7.7,8.4,12.0,13.2],
  [79.0,7.8,8.4,12.1,13.3],
  [79.5,7.8,8.5,12.2,13.4],
  [80.0,7.9,8.6,12.3,13.6],
  [80.5,8.0,8.7,12.4,13.7],
  [81.0,8.1,8.8,12.6,13.9],
  [81.5,8.2,8.9,12.7,14.0],
  [82.0,8.3,9.0,12.8,14.1],
  [82.5,8.4,9.1,13.0,14.3],
  [83.0,8.5,9.2,13.1,14.5],
  [83.5,8.5,9.3,13.3,14.6],
  [84.0,8.6,9.4,13.4,14.8],
  [84.5,8.7,9.5,13.5,14.9],
  [85.0,8.8,9.6,13.7,15.1],
  [85.5,8.9,9.7,13.8,15.3],
  [86.0,9.0,9.8,14.0,15.4],
  [86.5,9.1,9.9,14.2,15.6],
  [87.0,9.2,10.0,14.3,15.8],
  [87.5,9.3,10.1,14.5,15.9],
  [88.0,9.4,10.2,14.6,16.1],
  [88.5,9.5,10.3,14.8,16.3],
  [89.0,9.6,10.4,14.9,16.4],
  [89.5,9.7,10.5,15.1,16.6],
  [90.0,9.8,10.6,15.2,16.8],
  [90.5,9.9,10.7,15.4,16.9],
  [91.0,10.0,10.9,15.5,17.1],
  [91.5,10.1,11.0,15.7,17.3],
  [92.0,10.2,11.1,15.8,17.4],
  [92.5,10.3,11.2,16.0,17.6],
  [93.0,10.4,11.3,16.1,17.8],
  [93.5,10.5,11.4,16.3,17.9],
  [94.0,10.6,11.5,16.4,18.1],
  [94.5,10.7,11.6,16.6,18.3],
  [95.0,10.8,11.7,16.7,18.5],
  [95.5,10.8,11.8,16.9,18.6],
  [96.0,10.9,11.9,17.0,18.8],
  [96.5,11.0,12.0,17.2,19.0],
  [97.0,11.1,12.1,17.4,19.2],
  [97.5,11.2,12.2,17.5,19.3],
  [98.0,11.3,12.3,17.7,19.5],
  [98.5,11.4,12.4,17.9,19.7],
  [99.0,11.5,12.5,18.0,19.9],
  [99.5,11.6,12.7,18.2,20.1],
  [100.0,11.7,12.8,18.4,20.3],
  [100.5,11.9,12.9,18.6,20.5],
  [101.0,12.0,13.0,18.7,20.7],
  [101.5,12.1,13.1,18.9,20.9],
  [102.0,12.2,13.3,19.1,21.1],
  [102.5,12.3,13.4,19.3,21.4],
  [103.0,12.4,13.5,19.5,21.6],
  [103.5,12.5,13.6,19.7,21.8],
  [104.0,12.6,13.8,19.9,22.0],
  [104.5,12.8,13.9,20.1,22.3],
  [105.0,12.9,14.0,20.3,22.5],
  [105.5,13.0,14.2,20.5,22.7],
  [106.0,13.1,14.3,20.8,23.0],
  [106.5,13.3,14.5,21.0,23.2],
  [107.0,13.4,14.6,21.2,23.5],
  [107.5,13.5,14.7,21.4,23.7],
  [108.0,13.7,14.9,21.7,24.0],
  [108.5,13.8,15.0,21.9,24.3],
  [109.0,13.9,15.2,22.1,24.5],
  [109.5,14.1,15.4,22.4,24.8],
  [110.0,14.2,15.5,22.6,25.1],
  [110.5,14.4,15.7,22.9,25.4],
  [111.0,14.5,15.8,23.1,25.7],
  [111.5,14.7,16.0,23.4,26.0],
  [112.0,14.8,16.2,23.6,26.2],
  [112.5,15.0,16.3,23.9,26.5],
  [113.0,15.1,16.5,24.2,26.8],
  [113.5,15.3,16.7,24.4,27.1],
  [114.0,15.4,16.8,24.7,27.4],
  [114.5,15.6,17.0,25.0,27.8],
  [115.0,15.7,17.2,25.2,28.1],
  [115.5,15.9,17.3,25.5,28.4],
  [116.0,16.0,17.5,25.8,28.7],
  [116.5,16.2,17.7,26.1,29.0],
  [117.0,16.3,17.8,26.3,29.3],
  [117.5,16.5,18.0,26.6,29.6],
  [118.0,16.6,18.2,26.9,29.9],
  [118.5,16.8,18.4,27.2,30.3],
  [119.0,16.9,18.5,27.4,30.6],
  [119.5,17.1,18.7,27.7,30.9],
  [120.0,17.3,18.9,28.0,31.2]
];

// ─── GROWTH CALC HELPERS ─────────────────────────────────────────────────────
function interpAge(table, ageMonths) {
  const m = Math.max(0, Math.min(60, Math.round(ageMonths)));
  let lo = table[0], hi = table[table.length - 1];
  for (let i = 0; i < table.length; i++) {
    if (table[i][0] <= m) lo = table[i];
    if (table[i][0] >= m) { hi = table[i]; break; }
  }
  if (lo[0] === hi[0]) return lo;
  const t = (m - lo[0]) / (hi[0] - lo[0]);
  return lo.map((v, i) => i === 0 ? m : v + t * (hi[i] - v));
}

function interpHeight(table, heightCm) {
  const h = Math.max(table[0][0], Math.min(table[table.length-1][0], heightCm));
  let lo = table[0], hi = table[table.length - 1];
  for (let i = 0; i < table.length; i++) {
    if (table[i][0] <= h) lo = table[i];
    if (table[i][0] >= h) { hi = table[i]; break; }
  }
  if (lo[0] === hi[0]) return lo;
  const t = (h - lo[0]) / (hi[0] - lo[0]);
  return lo.map((v, i) => i === 0 ? h : v + t * (hi[i] - v));
}

function classifyBBU(weight, row) {
  const [, sd3n, sd2n, sd2p, sd3p] = row;
  if (weight < sd3n) return { label: "Gizi Buruk", color: "red", level: -3 };
  if (weight < sd2n) return { label: "Gizi Kurang", color: "orange", level: -2 };
  if (weight <= sd2p) return { label: "Gizi Baik", color: "green", level: 0 };
  if (weight <= sd3p) return { label: "Berisiko Gizi Lebih", color: "yellow", level: 2 };
  return { label: "Gizi Lebih / Obesitas", color: "red", level: 3 };
}

function classifyTBU(height, row) {
  const [, sd3n, sd2n, sd2p, sd3p] = row;
  if (height < sd3n) return { label: "Sangat Pendek", color: "red", level: -3 };
  if (height < sd2n) return { label: "Pendek", color: "orange", level: -2 };
  if (height <= sd3p) return { label: "Normal", color: "green", level: 0 };
  return { label: "Tinggi", color: "blue", level: 3 };
}

function classifyBBTB(weight, row) {
  const [, sd3n, sd2n, sd2p, sd3p] = row;
  if (weight < sd3n) return { label: "Sangat Kurus", color: "red", level: -3 };
  if (weight < sd2n) return { label: "Kurus", color: "orange", level: -2 };
  if (weight <= sd2p) return { label: "Normal", color: "green", level: 0 };
  if (weight <= sd3p) return { label: "Berisiko Gemuk", color: "yellow", level: 2 };
  return { label: "Gemuk / Obesitas", color: "red", level: 3 };
}

function calcAllGrowth(gender, ageMonths, weight, height) {
  const isBoy = gender === "L";
  const bbuRow = interpAge(isBoy ? WHO_BBU_BOYS : WHO_BBU_GIRLS, ageMonths);
  const tbuRow = interpAge(isBoy ? WHO_TBU_BOYS : WHO_TBU_GIRLS, ageMonths);
  const bbtbRow = interpHeight(isBoy ? WHO_BBTB_BOYS : WHO_BBTB_GIRLS, height);
  return {
    bbu: classifyBBU(weight, bbuRow),
    tbu: classifyTBU(height, tbuRow),
    bbtb: classifyBBTB(weight, bbtbRow),
  };
}

// ─── QUESTION DATA: lt2m ─────────────────────────────────────────────────────
const C1A_QUESTIONS = [
  { id: "c1a1", text: "Apakah bibir/area sekitar mulut bayi tampak kebiruan saat menangis atau menyusu?", img: "/images/sengkolcare/Foto_bibir_cyanosis.png" },
  { id: "c1a2", text: "Apakah napas bayi terlihat sangat cepat, atau justru sangat lambat/megap-megap?" },
  { id: "c1a3", text: "Apakah terdengar suara merintih setiap kali bayi bernapas?" },
  { id: "c1a4", text: "Apakah cuping hidung ikut kembang-kempis saat bernapas, atau tampak tarikan kuat di sela iga/dada bagian bawah?", img: "/images/sengkolcare/retraksi_dada.png" },
  { id: "c1a5", text: "Apakah bayi lemas, tidak kuat bergerak, atau tidak mau/tidak kuat mengisap?" },
  { id: "c1a6", text: "Apakah bayi kejang (gerakan menyentak yang tidak terkendali)?" },
  { id: "c1a7", text: "Apakah badan bayi teraba sangat panas atau justru sangat dingin?" },
  { id: "c1a8", text: "Apakah bayi belum buang air besar dalam 48 jam sejak lahir?" },
  { id: "c1a9", text: "Apakah bayi muntah berwarna hijau, atau perutnya tampak sangat kembung disertai sulit bernapas?" },
  { id: "c1a10", text: "Apakah ada bagian tubuh (mata, pusar, kulit) yang bernanah banyak atau kemerahan yang meluas?", img: "/images/sengkolcare/bercak_kulit.png" },
];
const C1B_QUESTIONS = [
  { id: "c1b1", text: "Apakah bayi tampak tidak sadar atau sangat lemah dibandingkan biasanya?", level: "red" },
  { id: "c1b2", text: "Apakah mata bayi terlihat cekung?", level: "red", img: "/images/sengkolcare/Foto_mata_cekung.png" },
  { id: "c1b3", text: "Saat dicoba diberi minum/ASI, apakah bayi menolak sama sekali?", level: "red" },
  { id: "c1b4", text: "Apakah bayi menjadi terlalu rewel dan sulit ditenangkan?", level: "yellow" },
  { id: "c1b5", text: "Apakah bayi menjadi terlalu haus dan minum dengan lahap?", level: "yellow" },
];
const C1C_QUESTIONS = [
  { id: "c1c1", text: "Kuning muncul di hari pertama (<24 jam setelah lahir)?", level: "red", img: "/images/sengkolcare/Foto_ikterus_bayikuning.png" },
  { id: "c1c2", text: "Kuning masih ada setelah usia 14 hari?", level: "red" },
  { id: "c1c3", text: "Warna kuning sudah sampai ke telapak tangan/kaki?", level: "red" },
];
const C1D_QUESTIONS = [
  { id: "c1d1", text: "Apakah bayi disusui kurang dari 8 kali dalam 24 jam (1 hari)?", level: "yellow" },
  { id: "c1d2", text: "Apakah bayi mendapatkan makanan/minuman lain selain ASI atau diberikan minum lewat botol?", level: "yellow" },
  { id: "c1d3", text: "Apakah ada bercak putih di mulut atau celah bibir/langit-langit?", level: "yellow" },
  { id: "c1d4", text: "Apakah berat badan bayi tampak rendah menurut usianya?", level: "red" },
  { id: "c1d5", text: "Apakah posisi/perlekatan menyusui tampak bermasalah (bayi sering lepas, rewel saat menyusu)?", level: "yellow" },
];

// ─── QUESTION DATA: 2m5y ─────────────────────────────────────────────────────
const C2A_QUESTIONS = [
  { id: "c2a1", text: "Apakah anak tidak bisa minum/menyusu sama sekali?", level: "red" },
  { id: "c2a2", text: "Apakah anak memuntahkan semua yang diminum/dimakan?", level: "red" },
  { id: "c2a3", text: "Apakah anak kejang selama sakit ini?", level: "red" },
  { id: "c2a4", text: "Apakah anak tidak sadar, tidak merespons, atau sangat sulit dibangunkan?", level: "red" },
  { id: "c2a5", text: "Apakah anak sangat gelisah/rewel dan tidak bisa ditenangkan sama sekali?", level: "red" },
  { id: "c2a6", text: "Apakah anak tampak sangat sesak, menolak berbaring, atau mencari posisi napas tertentu?", level: "red" },
  { id: "c2a7", text: "Apakah bibir/kulit anak tampak kebiruan atau sangat pucat?", level: "red", img: "/images/sengkolcare/Foto_bibir_cyanosis.png" },
  { id: "c2a8", text: "Apakah kulit anak terlihat seperti pola marmer/bercak-bercak?", level: "red", img: "/images/sengkolcare/pola_kulit_marmer.png" },
];
const C2B_QUESTIONS = [
  { id: "c2b1", text: "Apakah batuk disertai dengan demam >37,5°C?", level: "red" },
  { id: "c2b2", text: "Apakah napas anak terlihat cepat?", level: "red" },
  { id: "c2b3", text: "Apakah terlihat tarikan kuat di sela iga/bawah dada saat bernapas?", level: "red", img: "/images/sengkolcare/retraksi_dada.png" },
  { id: "c2b4", text: "Apakah terdengar bunyi \"ngik-ngik\" (wheezing) saat bernapas?", level: "red" },
  { id: "c2b5", text: "Apakah anak batuk sudah ≥2 minggu?", level: "red" },
];
const C2C_QUESTIONS = [
  { id: "c2c1", text: "Apakah diare >24 jam?", level: "red" },
  { id: "c2c2", text: "Apakah ada darah dalam tinja?", level: "red" },
  { id: "c2c3", text: "Apakah diare disertai dengan demam >37,5°C?", level: "red" },
  { id: "c2c4", text: "Apakah anak tampak tidak sadar atau sangat lemah dibandingkan biasanya?", level: "red" },
  { id: "c2c5", text: "Apakah mata anak terlihat cekung?", level: "red", img: "/images/sengkolcare/Foto_mata_cekung.png" },
  { id: "c2c6", text: "Saat dicoba diberi minum/ASI, apakah anak menolak sama sekali?", level: "red" },
  { id: "c2c7", text: "Apakah disertai dengan nyeri perut hebat?", level: "red" },
  { id: "c2c8", text: "Apakah anak menjadi terlalu rewel dan sulit ditenangkan?", level: "yellow" },
  { id: "c2c9", text: "Apakah anak menjadi terlalu haus dan minum dengan lahap?", level: "yellow" },
];
const C2D_QUESTIONS = [
  { id: "c2d1", text: "Apakah demam sudah >7 hari?", level: "red" },
  { id: "c2d2", text: "Apakah demam melebihi 39°C?", level: "red" },
  { id: "c2d3", text: "Apakah leher anak terasa kaku (menolak menunduk/nyeri saat leher ditekuk)?", level: "red" },
  { id: "c2d4", text: "Apakah ada riwayat bepergian ke daerah endemis malaria dalam 2 minggu terakhir? (Bilelando, Mertak, Kidang, Prabu, Kuta, Mekar Sari, Selong Belanak)", level: "red" },
  { id: "c2d5", text: "Apakah muncul ruam kemerahan menyeluruh disertai batuk/pilek/mata merah (curiga campak)?", level: "red" },
  { id: "c2d6", text: "Apakah terdapat tanda DBD? (tangan/kaki dingin & pucat, nadi lemah/cepat, sesak, muntah/BAB darah, nyeri perut hebat, gelisah, muncul bercak)", level: "red" },
  { id: "c2d7", text: "Apakah demam tidak turun dengan pemberian anti-demam?", level: "yellow" },
];
const C2E_QUESTIONS = [
  { id: "c2e1", text: "Apakah ada nyeri telinga atau anak sering menarik-narik telinganya?", level: "red" },
  { id: "c2e2", text: "Apakah keluar cairan/nanah dari telinga?", level: "red", img: "/images/sengkolcare/nanah_telinga.png" },
  { id: "c2e3", text: "Apakah ada bengkak nyeri di belakang telinga?", level: "red", img: "/images/sengkolcare/bengkak_telinga.png" },
];
const C2F_QUESTIONS = [
  { id: "c2f1", text: "Apakah ada bengkak di kedua kaki/tangan?", level: "red" },
  { id: "c2f2", text: "Apakah anak terlihat sangat kurus, tulang terlihat jelas?", level: "red" },
  { id: "c2f3", text: "Apakah anak sangat lemah, tidak mau makan sama sekali?", level: "red" },
  { id: "c2f4", text: "Apakah anak terlihat jauh lebih pendek dibanding anak seusianya?", level: "red" },
  { id: "c2f5", text: "Apakah perkembangan anak (bicara, gerak, sosial) tertinggal jauh dibanding anak seusianya?", level: "red" },
];

// ─── EDUKASI ──────────────────────────────────────────────────────────────────
const EDUKASI_LT2M = [
  "Pastikan bayi mendapat ASI eksklusif setiap 2–3 jam sekali.",
  "Pantau berat badan bayi secara rutin di Posyandu setiap bulan.",
  "Jaga kebersihan tali pusat dengan kain kering yang bersih.",
  "Pastikan bayi tidur telentang untuk mencegah risiko SIDS.",
  "Segera bawa ke Puskesmas jika bayi demam, sesak, atau tidak mau menyusu.",
  "Cuci tangan sebelum menyentuh atau menyusui bayi.",
];
const EDUKASI_2M5Y_BATUK = [
  "Hitung napas anak hanya saat anak dalam keadaan tenang.",
  "Beri pelega tenggorokan alami yang aman (misalnya ASI untuk bayi <6 bulan).",
  "Segera kembali ke fasilitas kesehatan bila napas tampak makin cepat/berat, atau anak sulit minum.",
];
const EDUKASI_2M5Y_DIARE = [
  "Berikan cairan tambahan (oralit, ASI, air matang) sebanyak yang anak mau.",
  "Berikan tablet/syrup zinc selama 10 hari berturut-turut meskipun diare sudah berhenti.",
  "Segera kembali bila tinja bercampur darah, anak malas minum, atau muncul tanda bahaya umum.",
];
const EDUKASI_2M5Y_DEMAM = [
  "Berikan parasetamol bila demam ≥38°C sesuai anjuran, dan pastikan anak tetap minum cukup.",
  "Gunakan kelambu (terutama di daerah endemis malaria) untuk mencegah gigitan nyamuk.",
  "Segera kembali bila demam menetap lebih dari yang dijadwalkan kontrol ulang, atau bertambah parah.",
];
const EDUKASI_2M5Y_TELINGA = [
  "Keringkan telinga dengan kain/tisu bersih yang digulung menjadi sumbu — jangan gunakan cotton bud (lidi kapas).",
  "Kontrol ulang 5 hari bila diberikan pengobatan untuk infeksi telinga.",
  "Segera kembali bila muncul benjolan nyeri di belakang telinga atau demam tinggi.",
];
const EDUKASI_2M5Y_GIZI = [
  "Timbang dan ukur (BB/panjang-tinggi badan) anak secara rutin setiap bulan di Posyandu/Puskesmas.",
  "Berikan makanan sesuai kelompok usia anak, dengan porsi cukup dan gizi seimbang.",
  "Segera periksakan bila berat badan anak tidak naik, turun, atau muncul bengkak di kaki/tangan.",
];
const EDUKASI_2M5Y_UMUM = [
  "Pastikan anak mendapat imunisasi lengkap sesuai jadwal.",
  "Biasakan mencuci tangan sebelum makan dan setelah bermain.",
  "Segera bawa ke Puskesmas jika kondisi anak tidak membaik dalam 24 jam.",
];

// ─── ANIMATION & HELPERS ─────────────────────────────────────────────────────
const pageVariants = {
  initial: (d) => ({ opacity: 0, x: d * 60 }),
  animate: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -60 }),
};

function ProgressBar({ current, total }) {
  return (
    <div className="w-full bg-green-100 rounded-full h-2 mb-6">
      <motion.div
        className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((current / total) * 100, 100)}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

function StepChip({ label, active, done }) {
  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
      done ? "bg-green-500 text-white border-green-500"
      : active ? "bg-white text-green-700 border-green-400 shadow-sm"
      : "bg-transparent text-gray-400 border-gray-200"
    }`}>
      {done && <RiCheckLine className="inline w-3 h-3 mr-0.5" />}{label}
    </div>
  );
}

function YesNoCard({ question, value, onChange, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3"
    >
      {question.img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={question.img} alt="Referensi kondisi" className="w-full rounded-xl object-cover max-h-44" />
      )}
      <p className="text-sm text-gray-700 leading-relaxed font-medium">{question.text}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
            value === true ? "bg-green-600 border-green-600 text-white shadow-md" : "bg-white border-gray-200 text-gray-500 hover:border-green-300"
          }`}
        >Ya</button>
        <button
          onClick={() => onChange(false)}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
            value === false ? "bg-green-500 border-green-500 text-white shadow-md" : "bg-white border-gray-200 text-gray-500 hover:border-green-300"
          }`}
        >Tidak</button>
      </div>
    </motion.div>
  );
}

function MainQuestion({ label, value, onChange }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-green-100 shadow-sm p-4 flex flex-col gap-3 mb-4">
      <p className="text-sm text-gray-700 leading-relaxed font-semibold">{label}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
            value === true ? "bg-green-600 border-green-600 text-white shadow-md" : "bg-white border-gray-200 text-gray-500 hover:border-green-400"
          }`}
        >Ya</button>
        <button
          onClick={() => onChange(false)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
            value === false ? "bg-gray-600 border-gray-600 text-white shadow-md" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
          }`}
        >Tidak</button>
      </div>
    </div>
  );
}

function ConditionalModule({ mainQuestion, mainValue, onMainChange, subQuestions, subAnswers, onSubChange }) {
  return (
    <div>
      <MainQuestion label={mainQuestion} value={mainValue} onChange={onMainChange} />
      <AnimatePresence>
        {mainValue === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}
            className="flex flex-col gap-3 overflow-hidden"
          >
            <p className="text-xs text-gray-500 px-1 mb-1">Jika ya, jawab pertanyaan berikut:</p>
            {subQuestions.map((q, i) => (
              <YesNoCard key={q.id} question={q} value={subAnswers[i]} onChange={(v) => onSubChange(i, v)} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel = "Lanjut", nextDisabled = false, showBack = true }) {
  return (
    <div className="flex gap-3 mt-6">
      {showBack && (
        <button onClick={onBack} className="p-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-all">
          <RiArrowLeftLine className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={onNext} disabled={nextDisabled}
        className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
          nextDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700 shadow-md active:scale-95"
        }`}
      >
        {nextLabel} {!nextDisabled && <RiArrowRightLine className="w-4 h-4" />}
      </button>
    </div>
  );
}

function SectionHeader({ icon: Icon, badge, title, color = "green" }) {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <div className={`rounded-2xl border p-4 mb-5 flex items-start gap-3 ${colors[color] || colors.green}`}>
      <Icon className="w-6 h-6 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">{badge}</p>
        <p className="text-base font-bold leading-tight">{title}</p>
      </div>
    </div>
  );
}

function GrowthBadge({ label, value, color }) {
  const colors = {
    red: "bg-red-100 text-red-700 border-red-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <div className={`rounded-xl border p-3 ${colors[color] || colors.green}`}>
      <p className="text-xs font-semibold opacity-70 mb-0.5">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

function GrowthDetailRow({ label, status, actual, normalMin, normalMax, unit }) {
  const colorMap = {
    red: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500 text-white", text: "text-red-700" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-500 text-white", text: "text-orange-700" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-500 text-white", text: "text-yellow-700" },
    green: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-500 text-white", text: "text-green-700" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500 text-white", text: "text-blue-700" },
  };
  const c = colorMap[status.color] || colorMap.green;
  return (
    <div className={`rounded-xl border ${c.bg} ${c.border} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{status.label}</span>
      </div>
      <div className="flex gap-4 text-xs">
        <div>
          <p className="text-gray-400">Nilai anak</p>
          <p className={`font-bold ${c.text}`}>{actual} {unit}</p>
        </div>
        <div className="border-l border-gray-200 pl-4">
          <p className="text-gray-400">Rentang normal (WHO)</p>
          <p className="font-bold text-gray-600">{normalMin?.toFixed(1)} – {normalMax?.toFixed(1)} {unit}</p>
        </div>
      </div>
    </div>
  );
}

// ─── RESULT PAGE ─────────────────────────────────────────────────────────────
function ResultPage({ flow, ageResult, growthStatus, data, onReset }) {
  const { c1aAnswers, c1bAnswers, c1cAnswers, c1dAnswers,
          c2aAnswers, c2bAnswers, c2cAnswers, c2dAnswers, c2eAnswers, c2fAnswers,
          hasDiare, hasKuning, hasASIMasalah, hasBatuk, hasDiare2, hasDemam, hasTelinga, hasGiziMasalah,
          bb, tb, gender } = data;

  // ── WHO normal ranges ─────────────────────────────────────────────────
  const isBoy = gender === "L";
  const ageM = ageResult ? Math.round(ageResult.months) : 0;
  const tbNum = parseFloat(tb) || 0;
  const bbuRow = ageResult ? interpAge(isBoy ? WHO_BBU_BOYS : WHO_BBU_GIRLS, ageM) : null;
  const tbuRow = ageResult ? interpAge(isBoy ? WHO_TBU_BOYS : WHO_TBU_GIRLS, ageM) : null;
  const bbtbRow = tbNum > 0 ? interpHeight(isBoy ? WHO_BBTB_BOYS : WHO_BBTB_GIRLS, tbNum) : null;

  // ── Determine urgency ─────────────────────────────────────────────────
  let isUrgent = false;
  const reasons = [];
  const edukasi = [];

  if (flow === "lt2m") {
    isUrgent = c1aAnswers.some(a => a === true);
    if (isUrgent) {
      const triggered = C1A_QUESTIONS.filter((_, i) => c1aAnswers[i] === true);
      reasons.push({ section: "Tanda Bahaya & Infeksi Bakteri (Bayi <2 Bulan)", items: triggered.map(q => q.text), urgent: true });
    }
    if (hasDiare) {
      const redItems = C1B_QUESTIONS.filter((q, i) => c1bAnswers[i] === true && q.level === "red").map(q => q.text);
      const yItems = C1B_QUESTIONS.filter((q, i) => c1bAnswers[i] === true && q.level === "yellow").map(q => q.text);
      if (redItems.length) reasons.push({ section: "Diare & Dehidrasi", items: redItems, level: "red" });
      if (yItems.length) reasons.push({ section: "Diare & Dehidrasi", items: yItems, level: "yellow" });
    }
    if (hasKuning) {
      const items = C1C_QUESTIONS.filter((_, i) => c1cAnswers[i] === true).map(q => q.text);
      if (items.length) reasons.push({ section: "Bayi Kuning (Ikterus)", items, level: "red" });
    }
    const c1dRed = C1D_QUESTIONS.filter((q, i) => c1dAnswers[i] === true && q.level === "red").map(q => q.text);
    const c1dYellow = C1D_QUESTIONS.filter((q, i) => c1dAnswers[i] === true && q.level === "yellow").map(q => q.text);
    if (c1dRed.length) reasons.push({ section: "Pemberian ASI & Berat Badan", items: c1dRed, level: "red" });
    if (c1dYellow.length) reasons.push({ section: "Pemberian ASI & Berat Badan", items: c1dYellow, level: "yellow" });

    if (isUrgent) edukasi.push(...EDUKASI_LT2M);
  } else {
    isUrgent = c2aAnswers.some(a => a === true);
    if (isUrgent) {
      const triggered = C2A_QUESTIONS.filter((_, i) => c2aAnswers[i] === true);
      reasons.push({ section: "Tanda Bahaya Umum", items: triggered.map(q => q.text), urgent: true });
    }
    if (hasBatuk) {
      const items = C2B_QUESTIONS.filter((_, i) => c2bAnswers[i] === true).map(q => q.text);
      if (items.length) reasons.push({ section: "Batuk / Kesulitan Bernapas", items, level: "red" });
    }
    if (hasDiare2) {
      const redItems = C2C_QUESTIONS.filter((q, i) => c2cAnswers[i] === true && q.level === "red").map(q => q.text);
      const yItems = C2C_QUESTIONS.filter((q, i) => c2cAnswers[i] === true && q.level === "yellow").map(q => q.text);
      if (redItems.length) reasons.push({ section: "Diare", items: redItems, level: "red" });
      if (yItems.length) reasons.push({ section: "Diare", items: yItems, level: "yellow" });
    }
    if (hasDemam) {
      const redItems = C2D_QUESTIONS.filter((q, i) => c2dAnswers[i] === true && q.level === "red").map(q => q.text);
      const yItems = C2D_QUESTIONS.filter((q, i) => c2dAnswers[i] === true && q.level === "yellow").map(q => q.text);
      if (redItems.length) reasons.push({ section: "Demam", items: redItems, level: "red" });
      if (yItems.length) reasons.push({ section: "Demam", items: yItems, level: "yellow" });
    }
    if (hasTelinga) {
      const items = C2E_QUESTIONS.filter((_, i) => c2eAnswers[i] === true).map(q => q.text);
      if (items.length) reasons.push({ section: "Masalah Telinga", items, level: "red" });
    }
    if (hasGiziMasalah) {
      const items = C2F_QUESTIONS.filter((_, i) => c2fAnswers[i] === true).map(q => q.text);
      if (items.length) reasons.push({ section: "Gizi & Pertumbuhan", items, level: "red" });
    }
    if (isUrgent) {
      edukasi.push(...EDUKASI_2M5Y_UMUM);
      if (hasBatuk) edukasi.push(...EDUKASI_2M5Y_BATUK);
      if (hasDiare2) edukasi.push(...EDUKASI_2M5Y_DIARE);
      if (hasDemam) edukasi.push(...EDUKASI_2M5Y_DEMAM);
      if (hasTelinga) edukasi.push(...EDUKASI_2M5Y_TELINGA);
      if (hasGiziMasalah || (growthStatus?.bbtb?.level !== 0)) edukasi.push(...EDUKASI_2M5Y_GIZI);
    }
  }

  // Gizi abnormal adds to reasons
  if (growthStatus) {
    const { bbu, tbu, bbtb } = growthStatus;
    const giziItems = [];
    if (bbtb.level !== 0) giziItems.push(`Status Gizi (BB/TB): ${bbtb.label}`);
    if (bbu.level !== 0) giziItems.push(`Status Berat/Umur (BB/U): ${bbu.label}`);
    if (tbu.level < 0) giziItems.push(`Status Tinggi/Umur (TB/U): ${tbu.label}`);
    if (giziItems.length) reasons.push({ section: "Status Pertumbuhan", items: giziItems, level: bbtb.level < -1 || bbu.level < -1 ? "red" : "yellow" });
  }

  // ── Build tanda bahaya sections (only for !isUrgent) ─────────────────
  const tandaBahayaSections = [];
  if (flow === "lt2m") {
    if (hasKuning) tandaBahayaSections.push({
      label: "E1", title: "Bayi Kuning (Ikterus)",
      items: [
        "Kuning muncul pada hari pertama kehidupan (< 24 jam setelah lahir)",
        "Kuning masih ada/muncul setelah bayi berusia > 14 hari",
        "Warna kuning sudah sampai ke telapak tangan atau telapak kaki",
      ],
    });
    if (hasASIMasalah) tandaBahayaSections.push({
      label: "E2", title: "Pemberian ASI & Berat Badan",
      items: [
        "Berat badan menurut umur tergolong rendah (baca di buku KIA)",
        "Menyusu kurang dari 8 kali dalam sehari",
        "Diberi minum dengan botol/dot, atau mendapat makanan/minuman lain selain ASI",
        "Posisi/pelekatan menyusui tidak benar, atau bayi tidak mengisap efektif",
        "Ada bercak putih di mulut atau celah bibir/langit-langit",
      ],
    });
    if (hasDiare) tandaBahayaSections.push({
      label: "E3", title: "Diare",
      items: [
        "Bayi lemas, hanya bergerak bila dirangsang, atau tidak bergerak sama sekali",
        "Mata terlihat cekung",
        "Gelisah/rewel terus-menerus",
      ],
    });
  } else {
    if (hasBatuk) tandaBahayaSections.push({
      label: "E4", title: "Batuk / Kesulitan Bernapas",
      items: [
        "Ada tarikan dinding dada ke dalam",
        "Napas cepat",
        "Penurunan kesadaran",
        "Suara ngik-ngik saat bernapas",
        "Terbangun dari tidur akibat terlalu sesak",
      ],
    });
    if (hasDiare2) tandaBahayaSections.push({
      label: "E5", title: "Diare",
      items: [
        "Penurunan kesadaran",
        "Mata cekung",
        "Tidak mau minum",
        "Sangat rewel hingga tidak bisa ditenangkan seperti biasanya",
        "Ada darah dalam tinja",
        "Diare berlangsung lebih dari 14 hari",
      ],
    });
    if (hasDemam) tandaBahayaSections.push({
      label: "E6", title: "Demam",
      items: [
        "Leher kaku",
        "Disertai penurunan kesadaran",
        "Demam turun, tetapi disertai tubuh lemas",
        "Demam berlangsung lebih dari 7 hari",
      ],
    });
    if (hasTelinga) tandaBahayaSections.push({
      label: "E7", title: "Masalah Telinga",
      items: [
        "Pembengkakan yang nyeri di belakang telinga",
        "Nyeri telinga yang sangat mengganggu",
        "Rasa penuh di telinga yang tidak wajar",
        "Cairan/nanah keluar dari telinga",
      ],
    });
    if (hasGiziMasalah) tandaBahayaSections.push({
      label: "E8", title: "Gizi & Pertumbuhan",
      items: [
        "Bengkak pada seluruh tubuh",
        "Tidak mau makan",
        "Dehidrasi berat",
        "Penurunan kesadaran",
        "Demam tinggi",
      ],
    });
  }

  const hasProblems = reasons.length > 0;
  const status = isUrgent ? "urgent" : hasProblems ? "watch" : "good";
  const statusConfig = {
    urgent: { bg: "bg-red-50", border: "border-red-200", icon: RiAlertLine, title: "Segera Bawa ke Fasilitas Kesehatan", sub: "Ditemukan tanda bahaya yang memerlukan penanganan segera", badge: "bg-red-600 text-white" },
    watch:  { bg: "bg-yellow-50", border: "border-yellow-200", icon: RiErrorWarningLine, title: "Perlu Pantau & Konsultasi", sub: "Ada beberapa gejala yang perlu perhatian lebih lanjut", badge: "bg-yellow-500 text-white" },
    good:   { bg: "bg-green-50", border: "border-green-200", icon: RiShieldCheckLine, title: "Kondisi Baik", sub: "Tidak ditemukan tanda bahaya yang mengkhawatirkan", badge: "bg-green-600 text-white" },
  };
  const cfg = statusConfig[status];

  const ageLabel = ageResult
    ? ageResult.months < 1 ? `${ageResult.days} hari`
      : ageResult.months < 24 ? `${Math.floor(ageResult.months)} bulan`
      : `${Math.floor(ageResult.months / 12)} thn ${Math.floor(ageResult.months % 12)} bln`
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Status banner ─────────────────────────────────────────────── */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
        className={`rounded-3xl border-2 ${cfg.bg} ${cfg.border} p-5 flex flex-col items-center gap-3 text-center`}>
        <div className={`w-14 h-14 rounded-full ${cfg.badge} flex items-center justify-center`}>
          <cfg.icon className="w-7 h-7" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800">{cfg.title}</p>
          <p className="text-sm text-gray-500 mt-1">{cfg.sub}</p>
        </div>
      </motion.div>

      {/* ── Status Pertumbuhan (expanded) ─────────────────────────────── */}
      {growthStatus && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <RiBodyScanLine className="w-4 h-4 text-green-600" />
            <p className="text-sm font-bold text-gray-700">Status Pertumbuhan</p>
          </div>
          {/* Data aktual anak */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-3 flex flex-wrap gap-x-6 gap-y-2">
            <div><p className="text-xs text-gray-400">Berat Badan</p><p className="text-sm font-bold text-gray-800">{bb} kg</p></div>
            <div><p className="text-xs text-gray-400">Tinggi / Panjang</p><p className="text-sm font-bold text-gray-800">{tb} cm</p></div>
            <div><p className="text-xs text-gray-400">Usia</p><p className="text-sm font-bold text-gray-800">{ageLabel}</p></div>
            <div><p className="text-xs text-gray-400">Jenis Kelamin</p><p className="text-sm font-bold text-gray-800">{gender === "L" ? "Laki-laki" : "Perempuan"}</p></div>
          </div>
          {/* Indikator detail */}
          <div className="flex flex-col gap-2">
            {bbtbRow && (
              <GrowthDetailRow label="Gizi (BB/TB)" status={growthStatus.bbtb}
                actual={bb} normalMin={bbtbRow[2]} normalMax={bbtbRow[3]} unit="kg" />
            )}
            {bbuRow && (
              <GrowthDetailRow label="Berat/Umur (BB/U)" status={growthStatus.bbu}
                actual={bb} normalMin={bbuRow[2]} normalMax={bbuRow[3]} unit="kg" />
            )}
            {tbuRow && (
              <GrowthDetailRow label="Tinggi/Umur (TB/U)" status={growthStatus.tbu}
                actual={tb} normalMin={tbuRow[2]} normalMax={tbuRow[3]} unit="cm" />
            )}
          </div>
        </motion.div>
      )}

      {/* ── Ringkasan Alasan — SELALU tampil ─────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <RiInformationLine className="w-4 h-4 text-blue-500" />
          <p className="text-sm font-bold text-gray-700">Ringkasan Alasan</p>
        </div>
        {reasons.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <RiCheckLine className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>Tidak ditemukan masalah dari jawaban yang diisi.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reasons.map((r, i) => (
              <div key={i}>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{r.section}</p>
                <ul className="space-y-1.5">
                  {r.items.map((item, j) => (
                    <li key={j} className={`flex items-start gap-2 text-sm ${r.urgent ? "text-red-700" : r.level === "red" ? "text-orange-700" : "text-yellow-700"}`}>
                      <RiAlertLine className={`w-4 h-4 mt-0.5 flex-shrink-0 ${r.urgent ? "text-red-500" : r.level === "red" ? "text-orange-400" : "text-yellow-400"}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── EDUKASI — hanya jika urgent ───────────────────────────────── */}
      {isUrgent && edukasi.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <RiInformationLine className="w-4 h-4 text-green-600" />
            <p className="text-sm font-bold text-gray-700">Panduan & Edukasi</p>
          </div>
          <ul className="space-y-2">
            {[...new Set(edukasi)].map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <RiCheckLine className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── TANDA BAHAYA — hanya jika TIDAK urgent ───────────────────── */}
      {!isUrgent && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <RiAlertLine className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-bold text-amber-700">Tanda Bahaya yang Perlu Diwaspadai</p>
          </div>
          <p className="text-xs text-amber-600 mb-4">
            Segera bawa ke Puskesmas atau fasilitas kesehatan terdekat jika muncul salah satu tanda berikut.
          </p>
          {tandaBahayaSections.length > 0 ? (
            <div className="flex flex-col gap-3">
              {tandaBahayaSections.map(section => (
                <div key={section.label} className="bg-white rounded-xl border border-amber-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">{section.label}</span>
                    <p className="text-xs font-bold text-amber-800">{section.title}</p>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-700">
                        <RiAlertLine className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-600">
              Tidak ada kondisi khusus yang perlu diwaspadai saat ini. Tetap pantau perkembangan anak dan segera konsultasikan ke Puskesmas jika ada perubahan yang mengkhawatirkan.
            </p>
          )}
        </motion.div>
      )}

      {/* ── Disclaimer ────────────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-600">Catatan:</strong> Hasil dari SengkolCare bersifat informatif berdasarkan panduan MTBS Kemenkes RI dan standar WHO. Bukan pengganti diagnosis tenaga medis. Konsultasikan kondisi anak ke Puskesmas atau tenaga kesehatan terdekat.
      </div>

      {/* ── Reset ─────────────────────────────────────────────────────── */}
      <button onClick={onReset}
        className="w-full py-3.5 rounded-2xl border-2 border-green-200 text-green-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-all">
        <RiRefreshLine className="w-4 h-4" /> Periksa Anak Lagi
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CekKesehatanPage() {
  const [step, setStep] = useState(0);
  const direction = useRef(1);

  // ── Age & flow state ──────────────────────────────────────────────────
  const [detectedFlow, setDetectedFlow] = useState(null);   // "lt2m" | "2m5y"
  const [ageWarning, setAgeWarning] = useState(null);       // null | "over5" | "over10"
  const [ageResult, setAgeResult] = useState(null);         // {days, months}
  const [growthStatus, setGrowthStatus] = useState(null);   // {bbu, tbu, bbtb}
  const [savedToDb, setSavedToDb] = useState(false);

  // ── Form fields ───────────────────────────────────────────────────────
  const [namaAnak, setNamaAnak] = useState("");
  const [gender, setGender] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [bbSekarang, setBbSekarang] = useState("");
  const [tbSekarang, setTbSekarang] = useState("");

  // ── lt2m states ───────────────────────────────────────────────────────
  const [c1aAnswers, setC1aAnswers] = useState(Array(10).fill(null));
  const [hasDiare, setHasDiare] = useState(null);
  const [c1bAnswers, setC1bAnswers] = useState(Array(5).fill(null));
  const [hasKuning, setHasKuning] = useState(null);
  const [c1cAnswers, setC1cAnswers] = useState(Array(3).fill(null));
  const [hasASIMasalah, setHasASIMasalah] = useState(null);
  const [c1dAnswers, setC1dAnswers] = useState(Array(5).fill(null));

  // ── 2m5y states ───────────────────────────────────────────────────────
  const [c2aAnswers, setC2aAnswers] = useState(Array(8).fill(null));
  const [hasBatuk, setHasBatuk] = useState(null);
  const [c2bAnswers, setC2bAnswers] = useState(Array(5).fill(null));
  const [hasDiare2, setHasDiare2] = useState(null);
  const [c2cAnswers, setC2cAnswers] = useState(Array(9).fill(null));
  const [hasDemam, setHasDemam] = useState(null);
  const [c2dAnswers, setC2dAnswers] = useState(Array(7).fill(null));
  const [hasTelinga, setHasTelinga] = useState(null);
  const [c2eAnswers, setC2eAnswers] = useState(Array(3).fill(null));
  const [hasGiziMasalah, setHasGiziMasalah] = useState(null);
  const [c2fAnswers, setC2fAnswers] = useState(Array(5).fill(null));

  // ── Auto-trigger gizi ─────────────────────────────────────────────────
  useEffect(() => {
    if (growthStatus && (growthStatus.bbtb.level !== 0 || growthStatus.bbu.level < 0)) {
      setHasGiziMasalah(prev => prev === null ? true : prev);
    }
  }, [growthStatus]);

  // ── Navigation ────────────────────────────────────────────────────────
  const goTo = (s) => {
    direction.current = s > step ? 1 : -1;
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setStep(0); setDetectedFlow(null); setAgeWarning(null); setAgeResult(null); setGrowthStatus(null);
    setGender(""); setTglLahir(""); setBbSekarang(""); setTbSekarang("");
    setC1aAnswers(Array(10).fill(null)); setHasDiare(null); setC1bAnswers(Array(5).fill(null));
    setHasKuning(null); setC1cAnswers(Array(3).fill(null)); setHasASIMasalah(null); setC1dAnswers(Array(5).fill(null));
    setC2aAnswers(Array(8).fill(null)); setHasBatuk(null); setC2bAnswers(Array(5).fill(null));
    setHasDiare2(null); setC2cAnswers(Array(9).fill(null)); setHasDemam(null);
    setC2dAnswers(Array(7).fill(null)); setHasTelinga(null); setC2eAnswers(Array(3).fill(null));
    setHasGiziMasalah(null); setC2fAnswers(Array(5).fill(null));
    setNamaAnak(""); setSavedToDb(false);
  };

  // ── Simpan hasil ke Supabase ─────────────────────────────────────────
  const simpanHasil = async (flow) => {
    if (!tglLahir || !gender) return;
    const gs = growthStatus;

    // Collect answers and determine urgency
    let isUrgent = false;
    let statusHasil = "baik";
    const kondisiYa = []; // [{id, text}] for all Yes answers
    const jawabanAll = {}; // {qid: bool|null, ...} all answers

    if (flow === "lt2m") {
      isUrgent = c1aAnswers.some(a => a === true);
      C1A_QUESTIONS.forEach((q, i) => {
        jawabanAll[q.id] = c1aAnswers[i];
        if (c1aAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
      });
      jawabanAll._diare = hasDiare;
      if (hasDiare) {
        C1B_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c1bAnswers[i];
          if (c1bAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
      jawabanAll._kuning = hasKuning;
      if (hasKuning) {
        C1C_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c1cAnswers[i];
          if (c1cAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
      jawabanAll._asi_masalah = hasASIMasalah;
      if (hasASIMasalah) {
        C1D_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c1dAnswers[i];
          if (c1dAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
    } else {
      isUrgent = c2aAnswers.some(a => a === true);
      C2A_QUESTIONS.forEach((q, i) => {
        jawabanAll[q.id] = c2aAnswers[i];
        if (c2aAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
      });
      jawabanAll._batuk = hasBatuk;
      if (hasBatuk) {
        C2B_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c2bAnswers[i];
          if (c2bAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
      jawabanAll._diare2 = hasDiare2;
      if (hasDiare2) {
        C2C_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c2cAnswers[i];
          if (c2cAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
      jawabanAll._demam = hasDemam;
      if (hasDemam) {
        C2D_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c2dAnswers[i];
          if (c2dAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
      jawabanAll._telinga = hasTelinga;
      if (hasTelinga) {
        C2E_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c2eAnswers[i];
          if (c2eAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
      jawabanAll._gizi = hasGiziMasalah;
      if (hasGiziMasalah) {
        C2F_QUESTIONS.forEach((q, i) => {
          jawabanAll[q.id] = c2fAnswers[i];
          if (c2fAnswers[i] === true) kondisiYa.push({ id: q.id, text: q.text });
        });
      }
    }

    const hasGiziAbnormal = gs && (gs.bbtb.level !== 0 || gs.bbu.level < 0 || gs.tbu.level < -1);
    if (isUrgent) statusHasil = "urgent";
    else if (kondisiYa.length > 0 || hasGiziAbnormal) statusHasil = "perlu_pantau";
    else statusHasil = "baik";

    try {
      await supabase.from("kesehatan_records").insert({
        nama: namaAnak || "Anonim",
        tanggal_lahir: tglLahir,
        jenis_kelamin: gender,
        umur_bulan: ageResult ? Math.round(ageResult.months) : null,
        berat_badan: parseFloat(bbSekarang) || null,
        tinggi_badan: parseFloat(tbSekarang) || null,
        status_bb_u: gs?.bbu?.label ?? null,
        status_tb_u: gs?.tbu?.label ?? null,
        status_bb_tb: gs?.bbtb?.label ?? null,
        flow_type: flow,
        status_hasil: statusHasil,
        is_urgent: isUrgent,
        kondisi_json: kondisiYa,
        jawaban_json: jawabanAll,
      });
      setSavedToDb(true);
    } catch (e) {
      console.error("Gagal simpan ke DB:", e);
    }
  };

  // ── Age processing on Step 1 submit ──────────────────────────────────
  const processAndNavigate = () => {
    const birth = new Date(tglLahir);
    const now = new Date();
    const days = Math.floor((now - birth) / 86400000);
    const months = days / 30.4375;
    setAgeResult({ days, months });

    if (days < 0) { setAgeWarning("over10"); return; } // future date
    if (days > 3652) { setAgeWarning("over10"); return; }

    const weight = parseFloat(bbSekarang);
    const height = parseFloat(tbSekarang);
    if (gender && weight > 0 && height > 0) {
      setGrowthStatus(calcAllGrowth(gender, months, weight, height));
    }

    if (days > 1826) {
      setAgeWarning("over5");
      setDetectedFlow("2m5y");
      goTo(10);
    } else {
      setAgeWarning(null);
      setDetectedFlow(days < 60 ? "lt2m" : "2m5y");
      goTo(days < 60 ? 2 : 10);
    }
  };

  // ── Step metadata ─────────────────────────────────────────────────────
  const STEPS_LT2M = ["Data Anak", "C1a", "C1b", "C1c", "C1d", "Hasil"];
  const STEPS_2M5Y = ["Data Anak", "C2a", "C2b", "C2c", "C2d", "C2e", "C2f", "Hasil"];

  function getChipIdx() {
    if (step === 0) return -1;
    if (step === 1) return 0;
    if (detectedFlow === "lt2m") {
      const map = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
      return map[step] ?? 0;
    } else {
      const map = { 10: 1, 11: 2, 12: 3, 13: 4, 14: 5, 15: 6, 16: 7 };
      return map[step] ?? 0;
    }
  }
  const chipIdx = getChipIdx();
  const steps = detectedFlow === "lt2m" ? STEPS_LT2M : STEPS_2M5Y;
  const totalSteps = steps.length - 1;

  // ── Disabled checks ───────────────────────────────────────────────────
  const step1Ok = gender && tglLahir && bbSekarang && tbSekarang && parseFloat(bbSekarang) > 0 && parseFloat(tbSekarang) > 0;
  const c1aOk = c1aAnswers.every(a => a !== null);
  const c1bOk = hasDiare !== null && (hasDiare === false || c1bAnswers.every(a => a !== null));
  const c1cOk = hasKuning !== null && (hasKuning === false || c1cAnswers.every(a => a !== null));
  const c1dOk = hasASIMasalah !== null && (hasASIMasalah === false || c1dAnswers.every(a => a !== null));
  const c2aOk = c2aAnswers.every(a => a !== null);
  const c2bOk = hasBatuk !== null && (hasBatuk === false || c2bAnswers.every(a => a !== null));
  const c2cOk = hasDiare2 !== null && (hasDiare2 === false || c2cAnswers.every(a => a !== null));
  const c2dOk = hasDemam !== null && (hasDemam === false || c2dAnswers.every(a => a !== null));
  const c2eOk = hasTelinga !== null && (hasTelinga === false || c2eAnswers.every(a => a !== null));
  const c2fOk = hasGiziMasalah !== null && (hasGiziMasalah === false || c2fAnswers.every(a => a !== null));

  // ── Header ────────────────────────────────────────────────────────────
  const showHeader = step > 0 && step !== 6 && step !== 16;
  const ageMonths = ageResult ? Math.round(ageResult.months) : null;
  const ageLabel = ageResult
    ? ageResult.months < 1 ? `${ageResult.days} hari`
      : ageResult.months < 24 ? `${Math.floor(ageResult.months)} bulan`
      : `${Math.floor(ageResult.months / 12)} thn ${Math.floor(ageResult.months % 12)} bln`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-8 pb-24">

        {/* Header progress */}
        {showHeader && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => goTo(0)} className="flex items-center gap-1.5 text-green-700 text-xs font-semibold">
                <RiHomeLine className="w-4 h-4" /> SengkolCare
              </button>
              {ageLabel && <span className="text-xs text-gray-400 font-medium">{ageLabel} · {gender === "L" ? "Laki-laki" : "Perempuan"}</span>}
            </div>
            <ProgressBar current={chipIdx} total={totalSteps} />
            <div className="flex gap-1.5 flex-wrap">
              {steps.map((s, i) => (
                <StepChip key={i} label={s} active={i === chipIdx} done={i < chipIdx} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Over-5y warning banner (persists across 2m5y steps) */}
        {ageWarning === "over5" && step > 1 && step !== 16 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex gap-2.5 text-xs text-amber-700">
            <RiAlertLine className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
            <span>Form ini dirancang untuk usia 2 bulan–5 tahun. Tingkat relevansi untuk usia anak Anda mungkin lebih rendah.</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait" custom={direction.current}>
          <motion.div
            key={step}
            custom={direction.current}
            variants={pageVariants}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >

            {/* ── STEP 0: FRONT PAGE ───────────────────────────────────────── */}
            {step === 0 && (
              <div className="flex flex-col items-center text-center gap-8 pt-8">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring" }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                  <RiHeartPulseLine className="w-12 h-12 text-white" />
                </motion.div>
                <div>
                  <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-3xl font-black text-gray-900 mb-2">SengkolCare</motion.h1>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                    Deteksi dini kesehatan anak berbasis panduan MTBS Kemenkes RI & standar WHO — untuk usia 0 hingga 10 tahun.
                  </motion.p>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <motion.button
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    onClick={() => goTo(1)}
                    className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-base shadow-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <RiStethoscopeLine className="w-5 h-5" />
                    Cek Kesehatan Anak
                  </motion.button>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-xs text-gray-400">Didukung data WHO Child Growth Standards &amp; MTBS</motion.p>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="w-full grid grid-cols-3 gap-3">
                  {[
                    { icon: RiShieldCheckLine, label: "Berbasis MTBS" },
                    { icon: RiBodyScanLine, label: "3 Indikator Gizi" },
                    { icon: RiHospitalLine, label: "Rujukan Cepat" },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col items-center gap-1.5 shadow-sm">
                      <Icon className="w-5 h-5 text-green-600" />
                      <p className="text-xs text-gray-500 font-medium text-center leading-tight">{label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* ── STEP 1: INPUT DATA ANAK ──────────────────────────────────── */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiUserLine} badge="Langkah 1" title="Data Anak" color="green" />

                {/* Nama Anak */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Nama Anak <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi"
                    value={namaAnak}
                    onChange={(e) => setNamaAnak(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                {/* Gender */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Jenis Kelamin</p>
                  <div className="flex gap-2">
                    {[{ v: "L", l: "Laki-laki" }, { v: "P", l: "Perempuan" }].map(({ v, l }) => (
                      <button key={v} onClick={() => setGender(v)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                          gender === v ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-200 text-gray-500 hover:border-green-300"
                        }`}>{l}</button>
                    ))}
                  </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    <RiCalendarLine className="inline w-4 h-4 mr-1.5 text-green-600" />
                    Tanggal Lahir
                  </label>
                  <input
                    type="date" value={tglLahir}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={e => setTglLahir(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 transition-all"
                  />
                  {tglLahir && (() => {
                    const d = Math.floor((new Date() - new Date(tglLahir)) / 86400000);
                    const m = d / 30.4375;
                    const label = m < 1 ? `${d} hari` : m < 24 ? `${Math.floor(m)} bulan ${d % 30} hari` : `${Math.floor(m/12)} tahun ${Math.floor(m%12)} bulan`;
                    const isOver = d > 3652;
                    return (
                      <p className={`text-xs mt-1.5 font-medium ${isOver ? "text-red-500" : "text-green-600"}`}>
                        Usia: {label}{isOver ? " — di luar rentang sistem (maks. 10 tahun)" : ""}
                      </p>
                    );
                  })()}
                </div>

                {/* BB */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    <RiScales3Line className="inline w-4 h-4 mr-1.5 text-green-600" />
                    Berat Badan Sekarang (kg)
                  </label>
                  <input
                    type="number" min="0.5" max="60" step="0.1" value={bbSekarang}
                    placeholder="Contoh: 8.5"
                    onChange={e => setBbSekarang(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 transition-all"
                  />
                </div>

                {/* TB */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    <RiRulerLine className="inline w-4 h-4 mr-1.5 text-green-600" />
                    Panjang / Tinggi Badan Sekarang (cm)
                  </label>
                  <input
                    type="number" min="30" max="130" step="0.1" value={tbSekarang}
                    placeholder="Contoh: 72"
                    onChange={e => setTbSekarang(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 transition-all"
                  />
                </div>

                {/* Over-10 rejection */}
                {ageWarning === "over10" && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-2.5 text-sm text-red-700">
                    <RiAlertLine className="w-5 h-5 flex-shrink-0 text-red-500" />
                    <span>Usia anak melebihi 10 tahun. Sistem ini dirancang untuk anak usia 0–10 tahun. Silakan konsultasikan langsung ke tenaga kesehatan.</span>
                  </div>
                )}

                <NavButtons
                  showBack={true}
                  onBack={() => goTo(0)}
                  onNext={processAndNavigate}
                  nextLabel="Mulai Pemeriksaan"
                  nextDisabled={!step1Ok || ageWarning === "over10"}
                />
              </div>
            )}

            {/* ── LT2M FLOW ────────────────────────────────────────────────── */}

            {/* STEP 2: C1a */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiAlertLine} badge="C1a · Bayi <2 Bulan" title="Tanda Bahaya & Infeksi Bakteri" color="red" />
                <p className="text-xs text-gray-500 px-1 -mt-2">Jawab setiap pertanyaan berdasarkan kondisi bayi saat ini.</p>
                <div className="flex flex-col gap-3">
                  {C1A_QUESTIONS.map((q, i) => (
                    <YesNoCard key={q.id} question={q} value={c1aAnswers[i]}
                      onChange={v => { const a = [...c1aAnswers]; a[i] = v; setC1aAnswers(a); }} index={i} />
                  ))}
                </div>
                <NavButtons onBack={() => goTo(1)} onNext={() => goTo(3)} nextDisabled={!c1aOk} />
              </div>
            )}

            {/* STEP 3: C1b — Diare */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiDropLine} badge="C1b · Bayi <2 Bulan" title="Pemeriksaan Diare" color="blue" />
                <ConditionalModule
                  mainQuestion="Apakah bayi mengalami diare (buang air besar cair lebih dari 3x sehari)?"
                  mainValue={hasDiare} onMainChange={v => { setHasDiare(v); if (!v) setC1bAnswers(Array(5).fill(null)); }}
                  subQuestions={C1B_QUESTIONS} subAnswers={c1bAnswers}
                  onSubChange={(i, v) => { const a = [...c1bAnswers]; a[i] = v; setC1bAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(2)} onNext={() => goTo(4)} nextDisabled={!c1bOk} />
              </div>
            )}

            {/* STEP 4: C1c — Kuning */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiSunLine} badge="C1c · Bayi <2 Bulan" title="Pemeriksaan Kuning (Ikterus)" color="orange" />
                <ConditionalModule
                  mainQuestion="Apakah bayi tampak kuning (ikterus) di kulit atau mata?"
                  mainValue={hasKuning} onMainChange={v => { setHasKuning(v); if (!v) setC1cAnswers(Array(3).fill(null)); }}
                  subQuestions={C1C_QUESTIONS} subAnswers={c1cAnswers}
                  onSubChange={(i, v) => { const a = [...c1cAnswers]; a[i] = v; setC1cAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(3)} onNext={() => goTo(5)} nextDisabled={!c1cOk} />
              </div>
            )}

            {/* STEP 5: C1d — ASI & BB */}
            {step === 5 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiParentLine} badge="C1d · Bayi <2 Bulan" title="Pemberian ASI & Berat Badan" color="purple" />
                <ConditionalModule
                  mainQuestion="Apakah Anda memiliki permasalahan pemberian ASI atau khawatir dengan berat badan bayi?"
                  mainValue={hasASIMasalah} onMainChange={v => { setHasASIMasalah(v); if (!v) setC1dAnswers(Array(5).fill(null)); }}
                  subQuestions={C1D_QUESTIONS} subAnswers={c1dAnswers}
                  onSubChange={(i, v) => { const a = [...c1dAnswers]; a[i] = v; setC1dAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(4)} onNext={() => { simpanHasil("lt2m"); goTo(6); }} nextDisabled={!c1dOk} />
              </div>
            )}

            {/* STEP 6: RESULT lt2m */}
            {step === 6 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiShieldCheckLine} badge="Hasil Pemeriksaan" title="SengkolCare — Bayi <2 Bulan" color="green" />
                {savedToDb && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-xl px-4 py-2.5">
                    <RiCheckLine className="text-base shrink-0" />
                    Hasil tersimpan ke database desa
                  </div>
                )}
                <ResultPage
                  flow="lt2m" ageResult={ageResult} growthStatus={growthStatus}
                  data={{ c1aAnswers, c1bAnswers, c1cAnswers, c1dAnswers, hasDiare, hasKuning, hasASIMasalah,
                          c2aAnswers: [], c2bAnswers: [], c2cAnswers: [], c2dAnswers: [], c2eAnswers: [], c2fAnswers: [],
                          hasBatuk: null, hasDiare2: null, hasDemam: null, hasTelinga: null, hasGiziMasalah: null,
                          bb: bbSekarang, tb: tbSekarang, gender }}
                  onReset={reset}
                />
              </div>
            )}

            {/* ── 2M5Y FLOW ────────────────────────────────────────────────── */}

            {/* STEP 10: C2a */}
            {step === 10 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiAlertLine} badge="C2a · 2 Bln–5 Thn" title="Tanda Bahaya Umum" color="red" />
                <p className="text-xs text-gray-500 px-1 -mt-2">Jawab berdasarkan kondisi anak saat ini atau dalam beberapa hari terakhir.</p>
                <div className="flex flex-col gap-3">
                  {C2A_QUESTIONS.map((q, i) => (
                    <YesNoCard key={q.id} question={q} value={c2aAnswers[i]}
                      onChange={v => { const a = [...c2aAnswers]; a[i] = v; setC2aAnswers(a); }} index={i} />
                  ))}
                </div>
                <NavButtons onBack={() => goTo(1)} onNext={() => goTo(11)} nextDisabled={!c2aOk} />
              </div>
            )}

            {/* STEP 11: C2b — Batuk */}
            {step === 11 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiFirstAidKitLine} badge="C2b · 2 Bln–5 Thn" title="Batuk / Kesulitan Bernapas" color="blue" />
                <ConditionalModule
                  mainQuestion="Apakah anak batuk atau mengalami kesulitan bernapas?"
                  mainValue={hasBatuk} onMainChange={v => { setHasBatuk(v); if (!v) setC2bAnswers(Array(5).fill(null)); }}
                  subQuestions={C2B_QUESTIONS} subAnswers={c2bAnswers}
                  onSubChange={(i, v) => { const a = [...c2bAnswers]; a[i] = v; setC2bAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(10)} onNext={() => goTo(12)} nextDisabled={!c2bOk} />
              </div>
            )}

            {/* STEP 12: C2c — Diare */}
            {step === 12 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiDropLine} badge="C2c · 2 Bln–5 Thn" title="Diare" color="blue" />
                <ConditionalModule
                  mainQuestion="Apakah anak mengalami diare (buang air besar cair ≥3x sehari)?"
                  mainValue={hasDiare2} onMainChange={v => { setHasDiare2(v); if (!v) setC2cAnswers(Array(9).fill(null)); }}
                  subQuestions={C2C_QUESTIONS} subAnswers={c2cAnswers}
                  onSubChange={(i, v) => { const a = [...c2cAnswers]; a[i] = v; setC2cAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(11)} onNext={() => goTo(13)} nextDisabled={!c2cOk} />
              </div>
            )}

            {/* STEP 13: C2d — Demam */}
            {step === 13 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiThermometerLine} badge="C2d · 2 Bln–5 Thn" title="Demam" color="orange" />
                <ConditionalModule
                  mainQuestion="Apakah anak demam (suhu ≥37.5°C atau terasa panas)?"
                  mainValue={hasDemam} onMainChange={v => { setHasDemam(v); if (!v) setC2dAnswers(Array(7).fill(null)); }}
                  subQuestions={C2D_QUESTIONS} subAnswers={c2dAnswers}
                  onSubChange={(i, v) => { const a = [...c2dAnswers]; a[i] = v; setC2dAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(12)} onNext={() => goTo(14)} nextDisabled={!c2dOk} />
              </div>
            )}

            {/* STEP 14: C2e — Telinga */}
            {step === 14 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiMusicLine} badge="C2e · 2 Bln–5 Thn" title="Masalah Telinga" color="purple" />
                <ConditionalModule
                  mainQuestion="Apakah anak mengalami masalah pada telinga (nyeri, keluar cairan, atau ada bengkak)?"
                  mainValue={hasTelinga} onMainChange={v => { setHasTelinga(v); if (!v) setC2eAnswers(Array(3).fill(null)); }}
                  subQuestions={C2E_QUESTIONS} subAnswers={c2eAnswers}
                  onSubChange={(i, v) => { const a = [...c2eAnswers]; a[i] = v; setC2eAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(13)} onNext={() => goTo(15)} nextDisabled={!c2eOk} />
              </div>
            )}

            {/* STEP 15: C2f — Gizi */}
            {step === 15 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiSeedlingLine} badge="C2f · 2 Bln–5 Thn" title="Status Gizi & Pertumbuhan" color="green" />

                {/* Show growth calc result */}
                {growthStatus && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Hasil Perhitungan Otomatis (BB/TB)</p>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <GrowthBadge label="BB/TB" value={growthStatus.bbtb.label} color={growthStatus.bbtb.color} />
                      <GrowthBadge label="BB/U" value={growthStatus.bbu.label} color={growthStatus.bbu.color} />
                      <GrowthBadge label="TB/U" value={growthStatus.tbu.label} color={growthStatus.tbu.color} />
                    </div>
                    {(growthStatus.bbtb.level !== 0 || growthStatus.bbu.level < 0) && (
                      <p className="text-xs text-amber-600 mt-2 font-medium">Status gizi menunjukkan perlu perhatian — pertanyaan tambahan di bawah sudah aktif.</p>
                    )}
                  </div>
                )}

                <ConditionalModule
                  mainQuestion="Apakah ada masalah gizi atau pertumbuhan yang Anda khawatirkan pada anak?"
                  mainValue={hasGiziMasalah} onMainChange={v => { setHasGiziMasalah(v); if (!v) setC2fAnswers(Array(5).fill(null)); }}
                  subQuestions={C2F_QUESTIONS} subAnswers={c2fAnswers}
                  onSubChange={(i, v) => { const a = [...c2fAnswers]; a[i] = v; setC2fAnswers(a); }}
                />
                <NavButtons onBack={() => goTo(14)} onNext={() => { simpanHasil("2m5y"); goTo(16); }} nextDisabled={!c2fOk} />
              </div>
            )}

            {/* STEP 16: RESULT 2m5y */}
            {step === 16 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={RiShieldCheckLine} badge="Hasil Pemeriksaan" title="SengkolCare — 2 Bln–5 Thn" color="green" />
                {savedToDb && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-xl px-4 py-2.5">
                    <RiCheckLine className="text-base shrink-0" />
                    Hasil tersimpan ke database desa
                  </div>
                )}
                <ResultPage
                  flow="2m5y" ageResult={ageResult} growthStatus={growthStatus}
                  data={{ c1aAnswers: [], c1bAnswers: [], c1cAnswers: [], c1dAnswers: [], hasDiare: null, hasKuning: null,
                          c2aAnswers, c2bAnswers, c2cAnswers, c2dAnswers, c2eAnswers, c2fAnswers,
                          hasBatuk, hasDiare2, hasDemam, hasTelinga, hasGiziMasalah,
                          bb: bbSekarang, tb: tbSekarang, gender }}
                  onReset={reset}
                />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
