import React from 'react';
import './nodes.css';
import { getBorders } from './assets';

export const Node = ({ data, onClick }) => {
    let extraClass = "";
    const { visited, border } = data;
    if ( data.visited ) extraClass += " visited";
    extraClass += getBorders(border);
    if ( data.path ) extraClass += " path";
    if ( data.head ) extraClass += " head";
    if ( data.end ) extraClass += " end";
    const { x, y } = data;
    return (
        <div onClick={() => onClick(x, y)} className={"node" + extraClass}>

        </div>
    )
}

