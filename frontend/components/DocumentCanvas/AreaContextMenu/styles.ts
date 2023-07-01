import { DetailedHTMLProps, FormHTMLAttributes } from 'react'

const getScaled = (value: number, scale: number) => Math.floor(value / scale)


const makeFormStyles = (x: number, y: number, scale: number) => {
  const shadowOffset = { x: getScaled(4, scale), y: getScaled(4, scale), color: 'rgba(50, 50, 50, 0.4)', blur: getScaled(20, scale) }

  return {
    position: 'absolute',
    fontSize: `${getScaled(16, scale)}px`,
    width: `${getScaled(224, scale)}px`,
    left: `${x}px`,
    top: `${y}px`,
    boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px ${shadowOffset.blur}px ${shadowOffset.color}`
  } as DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
}

const makeIconStyles = (scale: number) => {
  return {
    width: `${getScaled(14, scale)}px`,
    height: `${getScaled(14, scale)}px`
  }
}


export {
  makeFormStyles,
  makeIconStyles,
  getScaled,
}