function buildNewDate() {
    let date = new Date().toISOString()
    return date.substring(0, date.indexOf('T'));
}

export default buildNewDate;