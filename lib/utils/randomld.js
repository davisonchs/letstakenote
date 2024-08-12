
const generateUniqueId = () => {
    
    return (
        Math.random().toString(16) + 
        '0000000000000000' 
    ).substring(2, 18); 
};

module.exports = generateUniqueId;
