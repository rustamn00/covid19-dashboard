import obj from './index';

test('InfoTable content should be defined', () => {
  expect(obj.getDataObj()).toBeDefined();
});

test('InfoTable content should be div', () => {
  expect(Object.entries(obj.getDataObj)).not.toEqual(0);
});

test('Data about Covid should be defined', () => {
  expect(obj.getRealData()).toBeDefined();
});

test('Data about Covid should be an object', () => {
  expect(obj.getRealData()).toBeInstanceOf(Object);
});

test('Data about Covid should exist', () => {
  expect(obj.getRealData().length).toBe(1);
});
