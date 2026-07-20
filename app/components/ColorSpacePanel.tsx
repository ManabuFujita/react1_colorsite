"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from 'react-bootstrap';
import { Color } from '../types/Color';
import { ColorSelectors } from './ColorSelectors';
import { getShowColorSelector } from './ColorComponents';

export type ColorSpaceField = {
  text: string;
  id: string;
  field: string;
  min: number;
  max: number;
  step: number;
  formatValue: (raw: number) => number;
};

export type ColorSpaceConfig = {
  id: 'rgb' | 'hsv' | 'hsl' | 'cmyk';
  label: string;
  fields: ColorSpaceField[];
};

export const colorSpaceConfigs: ColorSpaceConfig[] = [
  {
    id: 'rgb',
    label: 'RGB',
    fields: [
      { text: 'R', id: 'rgb-r', field: 'r', min: 0, max: 255, step: 1, formatValue: (v) => Math.trunc(v) },
      { text: 'G', id: 'rgb-g', field: 'g', min: 0, max: 255, step: 1, formatValue: (v) => Math.trunc(v) },
      { text: 'B', id: 'rgb-b', field: 'b', min: 0, max: 255, step: 1, formatValue: (v) => Math.trunc(v) },
    ],
  },
  {
    id: 'hsv',
    label: 'HSV',
    fields: [
      { text: 'H(色相)', id: 'hsv-h', field: 'hsv_h', min: 0, max: 359, step: 0.0001, formatValue: (v) => Math.trunc(v) },
      { text: 'S(彩度)', id: 'hsv-s', field: 'hsv_s', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 1000) / 1000 },
      { text: 'V(明度)', id: 'hsv-v', field: 'hsv_v', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 1000) / 1000 },
    ],
  },
  {
    id: 'hsl',
    label: 'HSL',
    fields: [
      { text: 'H(色相)', id: 'hsl-h', field: 'hsl_h', min: 0, max: 359, step: 0.0001, formatValue: (v) => Math.trunc(v) },
      { text: 'S(彩度)', id: 'hsl-s', field: 'hsl_s', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 1000) / 1000 },
      { text: 'L(輝度)', id: 'hsl-l', field: 'hsl_l', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 1000) / 1000 },
    ],
  },
  {
    id: 'cmyk',
    label: 'CMYK',
    fields: [
      { text: 'C', id: 'cmyk-c', field: 'cmyk_c', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 100) },
      { text: 'M', id: 'cmyk-m', field: 'cmyk_m', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 100) },
      { text: 'Y', id: 'cmyk-y', field: 'cmyk_y', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 100) },
      { text: 'K', id: 'cmyk-k', field: 'cmyk_k', min: 0.0001, max: 1.001, step: 0.001, formatValue: (v) => Math.trunc(v * 100) },
    ],
  },
];

type ColorSpacePanelProps = {
  config: ColorSpaceConfig;
  color: Color;
  handleChangeRange: (e: React.ChangeEvent<HTMLInputElement>, colorName: string) => void;
  showColorRGB: boolean;
  showColorHSV: boolean;
  showColorHSL: boolean;
  showColorCMYK: boolean;
};

// RGB/HSV/HSL/CMYKそれぞれの色調整パネル(以前は4箇所にコピペされていた)
export const ColorSpacePanel = ({ config, color, handleChangeRange, showColorRGB, showColorHSV, showColorHSL, showColorCMYK }: ColorSpacePanelProps) => {
  return (
    <Col {...getShowColorSelector(config.id, showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>
      <Row className="my-2" id={config.id}>

        <Row className='my-2'>
          <Col xs='auto'>
            <FontAwesomeIcon icon={faPalette} />
            <span className='color-space-name'>{config.label}</span>
          </Col>
        </Row>

        {config.fields.map((field) => (
          <ColorSelectors
            key={field.id}
            text={field.text}
            id={field.id}
            color={color}
            colorValue={field.formatValue(color[field.field] as number)}
            colorRange={color[field.field] as number}
            handleChangeRange={(e) => handleChangeRange(e, field.field)}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        ))}

      </Row>
    </Col>
  );
};
