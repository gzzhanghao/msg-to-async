# msg-to-async

## Usage

```js
import { create } from 'msg-to-async';

const { invoke, handleMessage } = create({
  sendMessage(msg) {
    parent.postMessage(msg)
  },
  async handleInvoke(msg) {
    switch (msg.type) {
      case 'get-data':
        return data
    }
  },
});

addEventListener('message', event => {
  handleMessage(event.data);
});

// ...
const res = await invoke({
  type: 'get-data',
});
```
