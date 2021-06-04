import React from 'react';
import {HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, XYPlot, YAxis} from "react-vis";

export default function Histogram (props) {
    let isCalculated = props.isCalculated;
    let data = props.data;

    if (isCalculated) {
        return (
            <XYPlot height={400} width={800} color="#1faee9">
                <VerticalGridLines/>
                <HorizontalGridLines/>
                <XAxis/>
                <YAxis/>
                <VerticalBarSeries data={data}/>
            </XYPlot>
        );
    }

    else return <div />
};
