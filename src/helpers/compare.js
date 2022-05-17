const compareStartHour = (a, b) => {
    if(!a.startHour || !b.startHour)
        return 0;
    const [hourA, minutesA] = a.startHour.split(':');
    const [hourB, minutesB] = b.startHour.split(':');
    const deltaHour = Number(hourA) - Number(hourB);
    const deltaMinutes = Number(minutesA) - Number(minutesB);
    if( deltaHour !== 0)
        return deltaHour;
    else
        return deltaMinutes;
}

module.exports = {
    compareStartHour, 
}