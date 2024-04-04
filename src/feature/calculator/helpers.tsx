// 檢查數字 含數字
export const hasValue = (str: string): boolean => {
    const reg = /[0-9.]/;
    return reg.test(str);
};

// 檢查運算子
export const isOperator = (str: string): boolean => {
    const reg = /[+\-x/]/;
    return str.length === 1 && reg.test(str);
};

// 處理精度運算
const getBaseNumber = (num1: number, num2: number): number => {
    const num1Digits = (num1.toString().split(".")[1] || "").length;
    const num2Digits = (num2.toString().split(".")[1] || "").length;

    return Math.pow(10, Math.max(num1Digits, num2Digits));
};

// 處理長度
const handleFixed = (num: number): string => {
    let newNum = num.toString();

    if (newNum.length < 16) {
        return newNum;
    }

    const beforeValue = newNum.split(".")[0].length;
    const afterValue = (newNum.split(".")[1] || "").length;

    // 可能超過 Number.MAX_SAFE_INTEGER
    if (beforeValue > 15) {
        return "Error";
    }

    // 會破版時做小數位數控管
    if (afterValue > 0) {
        newNum = Number(newNum).toFixed(15 - beforeValue);
    }

    return newNum;
};

// 先乘除後加減
export const getResult = (formula: string[]) => {
    // 非正常運算
    if (formula.length < 3) return formula[0];

    let prevValue: number = Number(formula[0]);
    let nextValue: number;
    let operatorIndex = 1;
    let baseNum: number;
    const nextStack: string[] = [];

    // 先乘除
    while (operatorIndex < formula.length) {
        if (formula[operatorIndex] === "x" || formula[operatorIndex] === "/") {
            nextValue = Number(formula[operatorIndex + 1]);
            baseNum = getBaseNumber(prevValue, nextValue);

            switch (formula[operatorIndex]) {
                case "x":
                    prevValue =
                        (prevValue * baseNum * (nextValue * baseNum)) /
                        (baseNum * baseNum);
                    break;
                case "/":
                    prevValue = (prevValue * baseNum) / (nextValue * baseNum);
                    break;
            }
        } else {
            nextStack.push(prevValue.toString());
            nextStack.push(formula[operatorIndex]);
            prevValue = Number(formula[operatorIndex + 1]);
        }

        operatorIndex += 2;
    }

    // nextStack 空 return prevValue *算完結果
    // nextStack 非空 push prevValue *最後一個數
    if (nextStack.length === 0) {
        return handleFixed(prevValue);
    } else {
        nextStack.push(prevValue.toString());
    }

    // 後加減
    prevValue = Number(nextStack[0]);
    operatorIndex = 1;

    while (operatorIndex < nextStack.length) {
        nextValue = Number(nextStack[operatorIndex + 1]);
        baseNum = getBaseNumber(prevValue, nextValue);

        switch (nextStack[operatorIndex]) {
            case "+":
                prevValue =
                    (prevValue * baseNum + nextValue * baseNum) / baseNum;
                break;
            case "-":
                prevValue =
                    (prevValue * baseNum - nextValue * baseNum) / baseNum;
                break;
        }

        operatorIndex += 2;
    }

    return handleFixed(prevValue);
};
