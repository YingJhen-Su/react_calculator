import { useAppSelector } from "../../app/hooks";
import { selectDisplay, selectFormula } from "./calculatorSlice";

const CalculatorResult = () => {
    const formula = useAppSelector(selectFormula);
    const display = useAppSelector(selectDisplay);
    const allFormula = formula.join("") + display;

    return (
        <div className="calculator__result grow p-2 mb-3 bg-gray-700 text-white rounded flex flex-col items-end justify-between">
            <p className="break-all">{allFormula}</p>
            <p id="display" className="text-3xl break-all">
                {display || "0"}
            </p>
        </div>
    );
};

export default CalculatorResult;
