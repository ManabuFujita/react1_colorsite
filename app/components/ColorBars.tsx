import { Col, Row } from "react-bootstrap"
import { Color } from "./ColorFunctions";

interface ColorBarProps {
  // colorValue: number;
  text: string;
  textId: string;
  label: string;
  id: string;
  currentColorValue: number;
  handleChangeRange: (event: any, colorName: string) => void;
}

export const ColorBars = ({ text, textId, label, id, currentColorValue, handleChangeRange }: ColorBarProps) => {
  return (
    <div>

      <Col xs={3} md={2}>
        <form>
          <label className="form-label">
            {text}
            <input type="text" className="form-control" id={textId} onChange={() => {}} value={Math.trunc(currentColorValue)} />
          </label>
        </form>
      </Col>


      <Col xs={9} md={10} className='col-color-range'>
        <Row className='color-range'>
          <div className={label}>　</div>
          <input type="range" className="form-range" id={id} min="0" max="255" step="1" value={currentColorValue} onChange={(e) => handleChangeRange(e, id)}></input>
        </Row>
      </Col>
    </div>
  )
}