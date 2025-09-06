import React, { useEffect, useState } from 'react';
import HeatMap from '@uiw/react-heat-map'

const generateRandomData = (startDate, endDate) => {
    const data = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
        data.push({
            date: currentDate.toISOString().split('T')[0], //YYYY-MM-DD
            count: Math.floor(Math.random() * 50),
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};

const getPanelColor = (value) => {
    const color = [];
    for(let i = 0; i <= value; i++) {
        let greenValue = Math.floor((i/value) * 255);
        color[i] = `rgb(0, ${greenValue}, 0)`;
    }
    return color;
}

const HeatMapComponent = () => {
    const [data, setData] = useState([]);
    const [panelColors, setPanelColors] = useState({});

    useEffect(() => {
        const generatedData = generateRandomData('2023-01-01', '2023-03-30');
        setData(generatedData);
        const maxCount = Math.max(...generatedData.map(item => item.count));
        setPanelColors(getPanelColor(maxCount));
    }, []);

    return (
        <div>
            <h2>Recent Contributions</h2>
            <HeatMap
                className='HeatMapProfile'
                style={{height: "200px", width: "600px", color: "white", marginTop: "5rem"}}
                value={data}
                weekLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                panelColors={panelColors}
                rectSize={19}
                startDate={new Date('2023-01-01')}
                space={3}
                rectProps={{ rx: 2}}
            />
        </div>
    );
}

export default HeatMapComponent;