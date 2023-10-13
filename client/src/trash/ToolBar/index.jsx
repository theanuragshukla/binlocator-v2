import "./ToolBar.css";
import BottomNav from "../BottomNav"
const ToolBar = ({setpos}) => {
	return (
		<div className="toolBar">
		<BottomNav setpos={setpos}/>
		</div>
	)
}

export default ToolBar
