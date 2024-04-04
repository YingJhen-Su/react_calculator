import { useAppDispatch } from "../../app/hooks";
import {
    handleOperation,
    handleClear,
    handleDelete,
    handleResult,
} from "./calculatorSlice";

type OperatorProps = {
    id: string;
    value: string;
    span?: boolean;
};

const OperatorButton = ({ id, value, span = false }: OperatorProps) => {
    const dispatch = useAppDispatch();

    const handleClick = () => {
        switch (id) {
            case "clear":
                return dispatch(handleClear());
            case "delete":
                return dispatch(handleDelete());
            case "equals":
                return dispatch(handleResult());
            default:
                return dispatch(handleOperation(value));
        }
    };

    return (
        <button
            id={id}
            className={`bg-yellow-500 hover:bg-yellow-400 rounded ${
                span ? "col-span-2" : ""
            }`}
            onClick={handleClick}
        >
            {value}
        </button>
    );
};

export default OperatorButton;
