module.exports = {
  asTransferableAsyncGenerator,
  asTransferableAsyncIterable,
};

function asTransferableAsyncGenerator(asyncGenerator) {
  return (...args) => asTransferableAsyncIterable(asyncGenerator(...args));
}

function asTransferableAsyncIterable(asyncIterable) {
  function asyncIterator(...args) {
    const iterator = asyncIterable[Symbol.asyncIterator](...args);

    const transferableIterator = {
      next(...args) {
        return iterator.next(...args);
      },
    };

    if (iterator.return) {
      transferableIterator.return = function (...args) {
        return iterator.return(...args);
      };
    }
    if (iterator.throw) {
      transferableIterator.throw = function (...args) {
        return iterator.throw(...args);
      };
    }

    return transferableIterator;
  }

  return {
    ...asyncIterable,
    [Symbol.asyncIterator]: asyncIterator,
    ["@@asyncIterator"]: asyncIterator,
  };
}
