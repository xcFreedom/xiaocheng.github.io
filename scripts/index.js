const isSuppoerServiceWorker = () => 'serviceWorker' in window.navigator;
let defaultId = 0;
if (isSuppoerServiceWorker() && window.PushManager) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => (
        Promise.all([
          registration,
          askPermission(),
        ])
      ))
      .then(([registration]) => {
        bindNotificationBtn(registration);
        return subscribeUser(registration);
      })
      .then(subscription => sendSubscriptionToServer({
        subscription,
        id: Date.now(),
      }))
      .then((res) => {
        console.log('发送服务端数据成功', res);
      })
      .catch((err) => {
        console.log('service worker注册失败：', err);
      });

    bindPushButton();
  });

  navigator.serviceWorker.addEventListener('message', function (e) {
    var action = e.data;
    console.log(`receive post-message from sw, action is '${e.data}'`);
    switch (action) {
        case 'show-book':
            location.href = 'https://book.douban.com/subject/20515024/';
            break;
        case 'contact-me':
            location.href = 'mailto:someone@sample.com';
            break;
        default:
            document.querySelector('.panel').classList.add('show');
            break;
    }
  });
} else {
  alert('浏览器不支持sw');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUser(registration) {
  const publicKey = 'BAiHgmL2d2i1oomi3R4M6ETs9UgUQgDfQIOEaVPbALXxU7y_OFgC_k6C-wvMAOtbdVRVB7bCOY7dBhjNdN3sX_0';
  const applicationServerKey = urlBase64ToUint8Array(publicKey);
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  });
}

function sendSubscriptionToServer(body) {
  const url = '/subscription';
  console.log('subscription', JSON.stringify(body));
  return ajax(url, 'POST', JSON.stringify(body));
}

function ajax(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 5000;
    xhr.onreadystatechange = function() {
      let res;
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            res = JSON.parse(xhr.responseText);
          } catch (e) {
            res = xhr.responseText;
          }
          resolve(res);
        } else {
          reject();
        }
      }
    }
    xhr.onabort = reject;
    xhr.onerror = reject;
    xhr.ontimeout = reject;
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(data);
  });
}

function bindPushButton() {
  const pushBtn = document.querySelector('.push');
  pushBtn.addEventListener('click', () => {
    ajax('/push', 'POST', JSON.stringify({
      id: 0,
      payload: {
        text: '你好？来看看书吧'
      }
    })).then((res) => {
      console.log('发送消息成功', res);
    })
  });
}

function askPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(result => resolve(result));
    if (permissionResult && permissionResult.then) {
      permissionResult.then(resolve, reject);
    }
  }).then((result) => {
    if (result !== 'granted') {
      console.log('没有得到用户同意消息提醒的权限');
    }
  });
}

function bindNotificationBtn(registration) {
   /* ===== 添加提醒功能 ====== */
   document.querySelector('#js-notification-btn').addEventListener('click', function () {
      var title = 'PWA即学即用';
      var options = {
          body: '邀请你一起学习',
          icon: '../assets/images/book-128.png',
          actions: [{
              action: 'show-book',
              title: '去看看'
          }, {
              action: 'contact-me',
              title: '联系我'
          }],
          tag: 'pwa-starter',
          renotify: true
      };
      registration.showNotification(title, options);
  });
  /* ======================= */
}




/**
     * 生成书籍列表卡片（dom元素）
     * @param {Object} book 书籍相关数据
     */
    function createCard(book) {
      var li = document.createElement('li');
      // var img = document.createElement('img');
      var title = document.createElement('div');
      var author = document.createElement('div');
      var desc = document.createElement('div');
      var publisher = document.createElement('span');
      var price = document.createElement('span');
      title.className = 'title';
      author.className = 'author';
      desc.className = 'desc';
      // img.src = book.image;
      title.innerText = book.title;
      author.innerText = book.author;
      publisher.innerText = book.publisher;
      price.innerText = book.price;

      book.publisher && desc.appendChild(publisher);
      book.price && desc.appendChild(price);
      // li.appendChild(img);
      li.appendChild(title);
      li.appendChild(author);
      li.appendChild(desc);

      return li;
  }

  /**
   * 根据获取的数据列表，生成书籍展示列表
   * @param {Array} list 书籍列表数据
   */
  function fillList(list) {
      list.forEach(function (book) {
          var node = createCard(book);
          document.querySelector('#js-list').appendChild(node);
      });
  }

  /**
   * 控制tip展示与显示的内容
   * @param {string | undefined} text tip的提示内容
   */
  function tip(text) {
      if (text === undefined) {
          document.querySelector('#js-tip').style = 'display: none';
      }
      else {
          document.querySelector('#js-tip').innerHTML = text;
          document.querySelector('#js-tip').style = 'display: block';
      }
  }

  /**
   * 控制loading动画的展示
   * @param {boolean | undefined} isloading 是否展示loading
   */
  function loading(isloading) {
      if (isloading) {
          tip();
          document.querySelector('#js-loading').style = 'display: block';
      }
      else {
          document.querySelector('#js-loading').style = 'display: none';
      }
  }
  
  /**
   * 根据用户输入结果
   * 使用XMLHttpRequest查询并展示数据列表
   */
  function queryBook() {
      var input = document.querySelector('#js-search-input');
      var query = input.value;
      var xhr = new XMLHttpRequest();
      var url = '/book?q=' + query + '&fields=id,title,image,author,publisher,price';
      var cacheData;
      if (query === '') {
          tip('请输入关键词');
          return;
      }
      document.querySelector('#js-list').innerHTML = '';
      document.querySelector('#js-thanks').style = 'display: none';
      loading(true);
      var remotePromise = getApiDataRemote(url);
      getApiDataFromCache(url).then(function (data) {
          if (data) {
              loading(false);
              input.blur();            
              fillList(data.books);
              document.querySelector('#js-thanks').style = 'display: block';
          }
          cacheData = data || {};
          return remotePromise;
      }).then(function (data) {
          if (JSON.stringify(data) !== JSON.stringify(cacheData)) {
              loading(false);                
              input.blur();
              fillList(data.books);
              document.querySelector('#js-thanks').style = 'display: block';
          }
      });
  }

  /**
   * 监听“搜索”按钮点击事件
   */
  document.querySelector('#js-search-btn').addEventListener('click', function () {
      queryBook();
  });

  /**
   * 监听“回车”事件
   */
  window.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
          queryBook();
      }
  });