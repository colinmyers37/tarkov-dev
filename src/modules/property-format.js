import { Link } from 'react-router-dom';

import camelcaseToDashes from './camelcase-to-dashes';
import { formatCaliber } from './format-ammo';

const defaultFormat = (inputString) => {
    const baseFormat = camelcaseToDashes(inputString).replace(/-/g, ' ');

    return baseFormat.charAt(0).toUpperCase() + baseFormat.slice(1);
};

const firingModeFormat = (inputString) => {
    switch (inputString) {
        case 'single':
            return 'semi-auto';
        case 'fullauto':
            return 'full-auto';
        default:
            return inputString;
    }
};

const ammoLinkFormat = (inputString) => {
    const formattedName = formatCaliber(inputString);
    return <Link to={`/ammo/${formattedName}`}>{formattedName}</Link>;
};

const itemLinkFormat = (inputItem) => {
    return <Link to={`/item/${inputItem.normalizedName}`}>{inputItem.name}</Link>;
};

const formatter = (key, value) => {
    if (key === 'Weight') {
        return [key, `${value} kg`];
    }

    if (key === 'speedPenaltyPercent') {
        return ['Speed penalty', `${value}%`];
    }

    if (key === 'RicochetParams') {
        return ['Ricochet chance', value.x];
    }

    if (key === 'armorZone') {
        let displayKey = defaultFormat(key);

        if (value.length > 1) {
            displayKey = `${displayKey}s`;
        }

        return [displayKey, value.map(defaultFormat).join(', ')];
    }

    if (key === 'weaponErgonomicPenalty') {
        return ['Ergonomics', value];
    }

    if (key === 'mousePenalty') {
        return ['Turn speed', `${value} %`];
    }

    if (key === 'bFirerate') {
        return ['Rate of fire', value];
    }

    if (key === 'RecoilForceBack' || key === 'RecoilForceUp') {
        return [defaultFormat(key).replace(' force', ''), value];
    }

    if (key === 'weapFireType') {
        return ['Fire modes', value.map(firingModeFormat).join(', ')];
    }

    if (key === 'caliber') {
        return ['Ammunition', ammoLinkFormat(value)];
    }

    if (key === 'headSegments') {
        let displayKey = defaultFormat(key);

        return [displayKey, value.map(defaultFormat).join(', ')];
    }

    if (key === 'BlocksEarpiece') {
        let displayKey = defaultFormat(key);

        return [displayKey, value ? 'Yes' : 'No'];
    }

    if (key === 'zoomLevels') {
        let displayKey = defaultFormat(key);

        const zoomLevels = new Set();
        value.forEach(levels => zoomLevels.add(...levels));
        return [displayKey, [...zoomLevels].join(', ')];
    }

    if (key === 'grids') {
        let displayKey = defaultFormat(key);
        const gridCounts = {};
        value.sort((a, b) => (a.width*a.height) - (b.width*b.height)).forEach(grid => {
            const gridLabel = grid.width+'x'+grid.height;
            if (!gridCounts[gridLabel]) gridCounts[gridLabel] = 0;
            gridCounts[gridLabel]++;
        })
        const displayGrids = [];
        for (const label in gridCounts) {
            displayGrids.push(`${label}${gridCounts[label] > 1 ? `: ${gridCounts[label]}` : ''}`);
        }
        return [displayKey, displayGrids.join(', ')];
    }

    if (key === 'baseItem') {
        return ['Base Item', itemLinkFormat(value)];
    }

    const displayKey = defaultFormat(key);
    if (Array.isArray(value)) {
        return [displayKey, value.join(', ')];
    }

    // if the value is an object, return an empty array meaning that we
    // can't format that value
    if (typeof value === 'object') {
        return [displayKey, undefined];
    }

    return [displayKey, value];
};

export default formatter;
