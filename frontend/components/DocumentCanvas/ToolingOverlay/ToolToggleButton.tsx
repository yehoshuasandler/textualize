'use client'

import React from 'react'
import classNames from '../../../utils/classNames'

type Icon = (props: React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
  titleId?: string | undefined;
}) => JSX.Element

const ToolToggleButton = (props: { icon: Icon, hint: string, isActive: boolean, onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return <div className="group flex relative">
    <button className='pointer-events-auto p-2 bg-white rounded-md block mt-3 shadow-lg hover:bg-slate-100 aria-pressed:bg-indigo-400 aria-pressed:text-white'
      aria-pressed={props.isActive}
      onClick={props.onClick}>
      <props.icon className='w-5 h-5' />
    </button>
    <div className={classNames(
      'group-hover:opacity-100 transition-opacity0 p-1',
      'absolute -translate-x-full opacity-0 m-4 mx-auto',
    )}>
      <div className={'bg-gray-800 p-1 text-xs text-gray-100 rounded-md'}>
        {props.hint}
      </div>
    </div>
  </div>
}

export default ToolToggleButton
