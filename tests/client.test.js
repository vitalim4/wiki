const findAllByKey = (obj = {}, keyToFind = '') => {
    return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind)
            ? acc.concat(value)
            : (typeof value === 'object' && value)? acc.concat(findAllByKey(value, keyToFind)): acc
            , []) || [];
}

describe("client", () => {
    test("findAllByKey 1", async () => {
        const result = findAllByKey({key: 1},'key')
        expect(result).toEqual([1]);
    }); 
});