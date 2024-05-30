import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { hasValue, isOperator, getResult } from "./helpers";

export interface CalculatorState {
    formula: string[]; // 已輸入公式
    display: string; // 目前輸入值
    isEnd: boolean; // 是否已結束
}

const initialState: CalculatorState = {
    formula: [],
    display: "",
    isEnd: false,
};

export const calculatorSlice = createSlice({
    name: "calculator",
    initialState,
    reducers: {
        // 處理數值(0-9.)
        handleValue: (state, action: PayloadAction<string>) => {
            let value = action.payload;

            // copy
            let formula = [...state.formula];
            let display = state.display;
            let isEnd = state.isEnd;

            // 結束前一輪運算 先reset
            if (isEnd || display === "Error") {
                formula = [];
                display = "";
                isEnd = false;
            }

            // 最長10位
            if (display.length >= 10) return;

            // 前一位是運算子(+-x/)且再前一位不是，將運算子放進formula
            // ["2"] "+" "4"
            // ["2", "+"] "-" "4"
            if (isOperator(display)) {
                if (
                    formula.length !== 0 &&
                    !isOperator(formula[formula.length - 1])
                ) {
                    formula.push(display);
                    display = "";
                }
            }

            // 特例處理
            switch (value) {
                case "0":
                    // 最前面不能有多個0
                    if (display === "0" || display === "-0") return;
                    break;

                case ".":
                    // 一次只能有一個.
                    if (display.indexOf(".") !== -1) return;
                    // .在最前面須補0
                    if (display === "" || display === "-") {
                        value = "0.";
                    }
                    break;

                default:
                    // 第一位是0後輸入1-9需取代
                    if (display === "0" || display === "-0") {
                        display = display.replace("0", "");
                    }
            }

            // 更新state
            return {
                formula: [...formula],
                display: display + value,
                isEnd: isEnd,
            };
        },

        // 處理運算子(+-x/)
        handleOperation: (state, action: PayloadAction<string>) => {
            const operator = action.payload;

            // copy
            let formula = [...state.formula];
            let display = state.display;
            let isEnd = state.isEnd;

            // 錯誤處理 reset
            if (display === "Error") {
                formula = [];
                display = "";
                isEnd = false;
            }

            // 結束前一輪運算 把前一輪結果放首位 其他reset
            if (isEnd) {
                formula = [display];
                display = "";
                isEnd = false;
            }

            // 運算子在第一位，前面補0
            if (display === "" && formula.length === 0) {
                // 符號-視為負數開頭，不補0
                if (operator !== "-") {
                    formula = ["0"];
                }
            }

            // 前一位是數字，放進公式
            if (hasValue(display)) {
                // .結尾 去除
                if (display.charAt(display.length - 1) === ".") {
                    display = display.slice(0, display.length - 1);
                }

                // 任何數不能除以0 特例處理
                if (
                    (display === "0" || display === "-0") &&
                    formula.length !== 0 &&
                    formula[formula.length - 1] === "/"
                ) {
                    return {
                        ...state,
                        formula: [],
                        display: "Error",
                    };
                } else {
                    formula.push(display);
                    display = "";
                }
            }

            // 特例處理 前一位是運算子 +-x/ 需替換
            if (isOperator(display)) {
                // formula內再前一位是運算子去除 *display(-)狀況
                // ["2", "+"] "-" "x"
                // ["2", "+"] "-" "-"
                while (
                    formula.length !== 0 &&
                    isOperator(formula[formula.length - 1])
                ) {
                    formula.pop();
                }

                switch (operator) {
                    case "-":
                        // 此處視為負數開頭 push運算子
                        formula.push(display);
                        display = "";
                        break;
                    default:
                        // 此處視為符號取代
                        display = "";
                }
            }

            // 更新state
            return {
                formula: [...formula],
                display: display + operator,
                isEnd: isEnd,
            };
        },

        // 處理清除
        handleClear: () => {
            return {
                formula: [],
                display: "",
                isEnd: false,
            };
        },

        // 處理刪除
        handleDelete: (state) => {
            // 結束前一輪運算 reset
            if (state.isEnd || state.display === "Error") {
                return {
                    formula: [],
                    display: "",
                    isEnd: false,
                };
            }

            // copy
            const formula = [...state.formula];
            let display = state.display;

            // 未有任何運算 return
            if (display === "" && formula.length === 0) return;

            // 當下輸入大於一位，刪去最後一位
            if (display.length > 1) {
                display = display.slice(0, display.length - 1);

                // 當下輸入只有一位，公式有之前運算，取出前一個輸入
            } else if (display.length === 1) {
                display = "";
                if (formula.length) {
                    display = formula.pop() as string;
                }
            }

            // 更新state
            return {
                ...state,
                formula: [...formula],
                display: display,
            };
        },

        // 取得結果
        handleResult: (state) => {
            // 結束前一輪運算
            if (state.isEnd || state.display === "Error") return;
            // 未有任何運算 return
            if (state.display === "" && state.formula.length === 0) return;
            // 只有單一負數符號-
            if (state.display === "-" && state.formula.length === 0) return;

            // copy
            const formula = [...state.formula];
            let display = state.display;

            // 檢查 display 是否為數值
            if (hasValue(display)) {
                // .結尾 去除
                if (display.charAt(display.length - 1) === ".") {
                    display = display.slice(0, display.length - 1);
                }

                // 任何數不能除以0 特例處理
                if (
                    (display === "0" || display === "-0") &&
                    formula.length !== 0 &&
                    formula[formula.length - 1] === "/"
                ) {
                    return {
                        ...state,
                        formula: [],
                        display: "Error",
                    };
                } else {
                    formula.push(display);
                    display = "";
                }
            }

            // 特例處理 前一位是運算子 +-x/
            // ["2", "+"] "-"
            if (isOperator(display)) {
                // 再前一位是運算子去除 *display(-)狀況
                while (
                    formula.length !== 0 &&
                    isOperator(formula[formula.length - 1])
                ) {
                    formula.pop();
                }
            }

            // 取得運算結果 & 處理長度過長及小數位數
            display = getResult(formula);
            formula.push("=");

            // 更新state
            return {
                formula: [...formula],
                display: display,
                isEnd: true,
            };
        },
    },

    selectors: {
        selectFormula: (calculator) => calculator.formula,
        selectDisplay: (calculator) => calculator.display,
    },
});

export default calculatorSlice.reducer;

export const {
    handleValue,
    handleOperation,
    handleClear,
    handleDelete,
    handleResult,
} = calculatorSlice.actions;

export const { selectFormula, selectDisplay } = calculatorSlice.selectors;
