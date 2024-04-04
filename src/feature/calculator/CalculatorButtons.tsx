import ValueButton from "./ValueButton";
import OperatorButton from "./OperatorButton";

const CalculatorButtons = () => {
    return (
        <div className="calculator__buttons grid grid-cols-4 gap-2 ">
            <OperatorButton id="clear" value="AC" span={true} />
            <OperatorButton id="delete" value="DEL" />
            <OperatorButton id="divide" value="/" />
            <ValueButton id="seven" value="7" />
            <ValueButton id="eight" value="8" />
            <ValueButton id="nine" value="9" />
            <OperatorButton id="multiply" value="x" />
            <ValueButton id="four" value="4" />
            <ValueButton id="five" value="5" />
            <ValueButton id="six" value="6" />
            <OperatorButton id="add" value="+" />
            <ValueButton id="one" value="1" />
            <ValueButton id="two" value="2" />
            <ValueButton id="three" value="3" />
            <OperatorButton id="subtract" value="-" />
            <ValueButton id="zero" value="0" />
            <ValueButton id="decimal" value="." />
            <OperatorButton id="equals" value="=" span={true} />
        </div>
    );
};

export default CalculatorButtons;
