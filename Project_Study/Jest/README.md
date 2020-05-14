# Jest

Javascript Test Tool
Zero-configuration (설정 없는 테스트 환경 제공)

```shell script
npm install --save -dev jest
```

- Common Matchers
```javascript
    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    });
    
    test('object assignment', () => {
        const data = { one: 1};
        data['two'] = 2;
        expect(data).toEqual({one: 1, two: 2});
    });
    
    test('adding positive numbers is not zero', () => {
        for (let a = 1; a < 10; a++) {
            for (let b = 1; b < 10; b++) {
                expect(a + b).not.toBe(0);
            }
        }
    });
```

- Truthiness: undefined, null, false를 구별해 줄 수 있음.
```javascript
    test('null', () => {
        const n = null;
        expect(n).toBeNull();           // only null
        expect(n).toBeUndefined();      // only undefined 
        expect(n).not.toBeUndefined();  // opposite of toBeUndefined
        expect(n).not.toBeTruthy();     // Anything that an if statement treats as true  
        expect(n).toBeFalsy();          // Anything that an if statement treats as false 
    });
    
    test('zero', () => {
        const z = 0;
        expect(z).not.toBeNull();
        expect(z).toBeDefined();
        expect(z).not.toBeUndefined();
        expect(z).not.toBeTruthy();
        expect(z).toBeFalsy();
    });
```

- Number
```javascript
    test('two plus two', () => {
        const value = 2 + 2;
        expect(value).toBeGreaterThan(3);
        expect(value).toBeGreaterThanOrEqual(3.5);
        expect(value).toBeLessThan(5);
        expect(value).toBeLessThanOrEqual(4.5);
    
        expect(value).toBe(4);
        expect(value).toEqual(4);
    });
    
    // float값 테스트 시, toEqual 대신에 toBeCloseTo를 사용해야합니다.
    // toEqual 사용시 미세하게 값이 다르게 나올 수 있어 테스트가 틀릴수도 있습니다.
    
    test('adding floating point numbers', () => {
        const value = 0.1 + 0.2;
        expect(value).toBeCloseTo(0.3);
    });
    
    // Strings
    test('there is no I in team', () => {
        expect('team').not.toMatch(/I/);
    });
    
    test('but there is a "stop" in Christoph', () => {
        expect('Christoph').toMatch(/stop/);
    });
```

- Array
```javascript
    const shoppingList = [
        'diapers',
        'kleenex',
        'trash bags',
        'paper towels',
        'beer'
    ];
    
    test('the shopping list has beer on it', () => {
        expect(shoppingList).toContain('beer');
    });
```

=============================================================
예제코드 실행 법: (****은 github 계정의 access token)
```shell script
npm install
ACCESS_TOKEN=*************************** npm test
```
또는
dotenv 모듈과 joi 모듈 사용해 .env 파일에 원하는 값을 시스템 환경 변수로 등록하고 값에 대한 유효성 검증
