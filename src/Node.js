import React from 'react';
import './nodes.css';
import { getBorders } from './assets';

export const Node = ({ data }) => {
    let extraClass = "";
    const { visited, border } = data;
    if ( data.visited ) extraClass += " visited";
    extraClass += getBorders(border);
    return (
        <div className={"node" + extraClass}>

        </div>
    )
}

