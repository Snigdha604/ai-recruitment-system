const axios = require('axios');
const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const toPythonLiteral = (val) => {
    if (val === true) return 'True';
    if (val === false) return 'False';
    if (val === null) return 'None';
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
};

const solution = {
    code: `def solution(nums_target):
    nums = nums_target["nums"]
    target = nums_target["target"]
    d = {}
    for i, n in enumerate(nums):
        if target - n in d: return [d[target - n], i]
        d[n] = i`,
    language: 'python'
};

const testCase = {
    input: { nums: [2, 7, 11, 15], target: 9 },
    expected: [0, 1]
};

const inputStr = toPythonLiteral(testCase.input);
const fullCode = solution.code + `\nimport json\nprint(json.dumps(solution(${inputStr})))`;

console.log('--- Generated Code ---');
console.log(fullCode);
console.log('----------------------');

axios.post(PISTON_URL, {
    language: 'python',
    version: '3.10.0',
    files: [{ content: fullCode }],
}).then(r => {
    console.log('Piston Response:', r.data.run.stdout.trim());
    const expectedStr = JSON.stringify(testCase.expected);
    console.log('Match:', r.data.run.stdout.trim() === expectedStr);
}).catch(e => {
    console.error('Error:', e.response?.data || e.message);
});
