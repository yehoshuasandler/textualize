import { DetailedHTMLProps, FormHTMLAttributes } from 'react'

let scale = 1
const setScale = (newScale: number) => scale = newScale
const getScaled = (value: number) => Math.floor(value / scale)

let left = 0
let top = 0
const setPosition = (x: number, y: number) => {
  left = x
  top = y
}

const makeProportionalStyles = () => ({
  fontSize: getScaled(18),
  radius: getScaled(6),
  formPadding: getScaled(12),
  buttonPadding: getScaled(4),
  verticalMargin: getScaled(4),
  shadowOffset: {
    x: getScaled(4),
    y: getScaled(4),
    color: 'rgba(50, 50, 50, 0.4)',
    blur: getScaled(20),
  }
})

const makeFormStyles = () => {
  const proportionalStyles = makeProportionalStyles()
  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    textAlign: 'center',
    display: 'block',
    fontSize: `${proportionalStyles.fontSize}px`,
    backgroundColor: 'rgb(229, 231, 235)',
    borderRadius: `${proportionalStyles.radius}px`,
    borderTopLeftRadius: '0px',
    padding: `${proportionalStyles.formPadding}px`,
    boxShadow: `${proportionalStyles.shadowOffset.x}px ${proportionalStyles.shadowOffset.y}px ${proportionalStyles.shadowOffset.blur}px ${proportionalStyles.shadowOffset.color}`
  } as DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
}

const makeSharedButtonStyles = () => {
  const proportionalStyles = makeProportionalStyles()
  return {
    display: 'block',
    margin: `${proportionalStyles.verticalMargin}px auto`,
    width: '100%',
    border: 'solid 1px',
    borderColor: 'rgb(31, 41, 55)',
    borderRadius: `${proportionalStyles.radius}px`,
    padding: `${proportionalStyles.buttonPadding}px`,
  }
}

const reprocessButtonColors = {
  normal: { color: '#414C61', backgroundColor: '#E5E7EB' },
  hover: { color: '#E5E7EB', backgroundColor: '#9AB3E6' },
}

const copyButtonColors = {
  normal: { color: '#414C61', backgroundColor: '#E5E7EB' },
  hover: { color: '#E5E7EB', backgroundColor: '#9AB3E6' },
}

const deleteButtonColors = {
  normal: { color: '#DADCE0', backgroundColor: '#f87171' },
  hover: { color: '#E5E7EB', backgroundColor: '#AD5050' },
}

// Awful TS hackery
type styleDeclaration = Partial<CSSStyleDeclaration> & { [propName: string]: string };
const setMutableStylesOnElement = (e: React.MouseEvent<HTMLElement, MouseEvent>, stylesToSet: styleDeclaration) => {
  for (const style in stylesToSet) {
    (e.currentTarget.style as styleDeclaration)[style] = stylesToSet[style]
  }
}

export {
  setScale,
  setPosition,
  makeFormStyles,
  makeSharedButtonStyles,
  copyButtonColors,
  deleteButtonColors,
  reprocessButtonColors,
  setMutableStylesOnElement,
}