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

// 處理長度
const handleFixed = (num: number): string => {
    let newNum = num.toString();

    if (newNum.length <= 15) {
        return newNum;
    }

    const beforeValue = newNum.split(".")[0].length;
    const afterValue = (newNum.split(".")[1] || "").length;

    // 小數位數控管
    if (afterValue > 0) {
        // 保留小數空間
        if (beforeValue > 13) return "Error";
        newNum = Number(newNum).toFixed(14 - beforeValue);
    } else {
        // 不超過15位 Number.MAX_SAFE_INTEGER
        return "Error";
    }

    return newNum;
};

// 處理精度運算
const getBaseLength = (num1: number, num2: number): number[] => {
    const num1Digits = (num1.toString().split(".")[1] || "").length;
    const num2Digits = (num2.toString().split(".")[1] || "").length;

    return [num1Digits, num2Digits];
};

// 加法
const add = (num1: number, num2: number): number => {
    const baseNum = Math.pow(10, Math.max(...getBaseLength(num1, num2)));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
};

// 減法
const sub = (num1: number, num2: number): number => {
    const baseNum = Math.pow(10, Math.max(...getBaseLength(num1, num2)));
    return (num1 * baseNum - num2 * baseNum) / baseNum;
};

// 乘法
const mul = (num1: number, num2: number): number => {
    const [baseLen1, baseLen2] = getBaseLength(num1, num2);
    return (
        (Number(num1.toString().replace(".", "")) *
            Number(num2.toString().replace(".", ""))) /
        Math.pow(10, baseLen1 + baseLen2)
    );
};

// 除法
const divi = (num1: number, num2: number): number => {
    const [baseLen1, baseLen2] = getBaseLength(num1, num2);
    return mul(
        Number(num1.toString().replace(".", "")) /
            Number(num2.toString().replace(".", "")),
        Math.pow(10, baseLen2 - baseLen1)
    );
};

// 先乘除後加減
export const getResult = (formula: string[]) => {
    // 非正常運算
    if (formula.length < 3) return formula[0];

    let prevValue: number = Number(formula[0]);
    let nextValue: number;
    let operatorIndex = 1;
    const nextStack: string[] = [];

    // 先乘除
    while (operatorIndex < formula.length) {
        if (formula[operatorIndex] === "x" || formula[operatorIndex] === "/") {
            nextValue = Number(formula[operatorIndex + 1]);

            switch (formula[operatorIndex]) {
                case "x":
                    prevValue = mul(prevValue, nextValue);
                    break;
                case "/":
                    prevValue = divi(prevValue, nextValue);
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

        switch (nextStack[operatorIndex]) {
            case "+":
                prevValue = add(prevValue, nextValue);
                break;
            case "-":
                prevValue = sub(prevValue, nextValue);
                break;
        }

        operatorIndex += 2;
    }

    return handleFixed(prevValue);
};
