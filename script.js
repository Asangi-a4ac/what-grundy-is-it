// 計算プログラムはAckvyさんのhttps://ack61.github.io/mathpower2022-31game/から借用

const result_table = {};
const colors = ['#FFFFFF', '#FFF0F0', '#FFF8F0', '#FFFFF0', '#F0FFF0', '#F0FFFF', '#F0F0FF', '#F8F0FF', '#FFF0FF', '#F8F8F8']

function updateButton(S, length) {
  // console.log(S);
  let G = [];
  for(let i = 0; i < S[0]; i++){
    G[i] = 0;
  }
  let index = S[0];

  for(let i = 1; i < length; i++){
    let exist = [];
    for(let j = 0; j < S.length; j++){
      let next = i - S[j];
      if(next >= 0){
        exist.push(G[next]);
      }
    }
    exist.sort((a, b) => a - b);
    let min = 0;
    for(let j = 0; j < S.length; j++){
      if(min == exist[j]){
        min++;
      }else if(min != exist[j] + 1){
        break;
      }
    }
    G[i] = min;
  }
  return G;
}

function preCalcPeriod() {
  setTimeout(calcPeriod, 1);
}

function calcPeriod(T) {
  S = T.slice().sort((a, b) => a - b);
  console.log(["hello", S]);
  if (S.length == 0) {
    return {
      period: undefined,
      prePeriod: undefined,
      bitPeriod: undefined,
      preBitPeriod: undefined,
    };
  }
  let G = [];
  let old = 1024;
  let n = 2048;
  for(let i = 0; i < S[0]; i++){
    G[i] = 0;
  }
  let index = S[0];
  let finish = false;
  let bin_finish = false;

  let period = 1;
  let pre_period = 1;
  let bin_period;
  let pre_bin_period = 1;
  let max_start_period = 1;

  while(true){
    let exist = [];
    for(let j = 0; j < S.length; j++){
      let next = index - S[j];
//      console.log(next);
      if(next >= 0){
        exist.push(G[next]);
      }
    }
    exist.sort((a, b) => a - b);
//    console.log(exist);
    let min = 0;
    for(let j = 0; j < S.length; j++){
//      console.log("min:" + min + ", ex:"+exist[j]);
      if(min == exist[j]){
        min++;
      }else if(min != exist[j] + 1){
        break;
      }
    }
    G[index] = min;
//    console.log(min);
//    add(index, min);

    if(index == n){
      if(!bin_finish){
        for(let i = old + 1; i < n - S[S.length-1]; i++){
          let ok = true;
          for(let j = 0; j < S[S.length-1]; j++){
            if(!(G[old+j] == 0 && G[i+j] == 0 || G[old+j] != 0 && G[i+j] != 0)){
              ok = false;
              break;
            }
          }
          if(ok){
            bin_finish = true;
            bin_period = i - old;
            break;
          }
        }
      }
      for(let i = old + 1; i < n - S[S.length-1]; i++){
        let ok = true;
        for(let j = 0; j < S[S.length-1]; j++){
          if(G[old+j] != G[i+j]){
            ok = false;
            break;
          }
        }
        if(ok){
//          console.log("@" + (i - old));          
          finish = true;
          // tr = document.createElement('tr');
          max_start_period = old;
          period = i - old;
          // tr.textContent = "周期: " + (i - old);
          // result_table.appendChild(tr);
          break;
        }
      }
      old = n;
      n *= 2;
    }
    if(finish){
      break;
    }
    index++;
  }

  {
    let left = 0;
    let right = max_start_period;
    while(left != right){
      let mid = Math.floor((left + right) / 2);
      let isOk = true;
      for(let i = 0; i < S[S.length-1]; i++){
        if((G[mid+i] == 0) != (G[period+mid+i] == 0)){
          isOk = false;
          break;
        }
      }
      if(isOk){
        right = mid;
      }else{
        left = mid + 1;
      }
    }
    // console.log(right);
    pre_bin_period = right;
  }
  {
    let left = 0;
    let right = max_start_period;
    while(left != right){
      let mid = Math.floor((left + right) / 2);
      let isOk = true;
      for(let i = 0; i < S[S.length-1]; i++){
  //      console.log(G[mid+i]);
  //      console.log(G[period+mid+i]);
  //      console.log(G[mid+i] == G[period+mid+i]);
        if(G[mid+i] != G[period+mid+i]){
          isOk = false;
          break;
        }
      }
  //    console.log(isOk);
  //    console.log(right);
      if(isOk){
        right = mid;
  //      console.log("うおお");
      }else{
        left = mid + 1;
      }
    }
    // console.log(right);
    pre_period = right;
  }
  return {
    period: period,
    prePeriod: pre_period,
    bitPeriod: bin_period,
    preBitPeriod: pre_bin_period,
  };
}

function calcOnlyPeriod() {
  console.log(input.value);
  while(result_table.firstChild) {
      result_table.removeChild(result_table.firstChild);
  }
  let S = input.value.split(',').map(Number);
  let S_max = S[S.length-1];
  let G = [];
  let check_ary = []
  let old = 1024;
  let n = 2048;
  while(old < S_max){
    old = n;
    n *= 2;
  }
  for(let i = 0; i < S[0]; i++){
    G[i] = 0;
  }
  let index = S[0];
  let mod_index = S[0];
  let finish = false;
  let bin_finish = false;

  let period = 1;
  let bin_period;
  let max_start_period = 1;

  let exist = [];

  while(true){
    for(let i = 0; i < S.length; i++){
      let next = (S_max + mod_index - S[i]) % S_max;
      exist[i] = next >= 0 ? G[next] : -1;
    }

    exist.sort((a, b) => a - b);

    let min = 0;
    for(let j = 0; j < S.length; j++){
      if(min == exist[j]){
        min++;
      }else if(min != exist[j] + 1){
        break;
      }
    }
    G[mod_index] = min;

    {
      isOk = true;
      mod_i = (index + 1) % S_max;
      for(let i = 0; i < S_max; i++){
//        if(check_ary[i] != G[(index + 1 + i)%S_max]){
        if(check_ary[i] != G[mod_i]){
          isOk = false;
          break;
        }
        mod_i++;
        mod_i = mod_i < S_max ? mod_i : mod_i - S_max;
      }
      if(isOk){
        period = index - S_max - old/2;
        finish = true;
        break;
      }
    }

    if(index == old + S_max){
      for(let i = 0; i < S_max; i++){
        check_ary[i] = G[(old + i + 1) % S_max];
      }
      old = n;
      n *= 2;
    }

    if(finish){
      break;
    }
    index++;
    mod_index++;
    mod_index %= S_max;
  }
  addToTable(result_table, ["period", period]);
}

function add(index, num) {
  let tr = document.createElement('tr');
  let l1 = document.createElement('td');
  let l2 = document.createElement('td');
  let l3 = document.createElement('td');
  l1.textContent = index;
  l2.textContent = num;
  l3.textContent = `${"●".repeat(num)}`;
  tr.appendChild(l1);
  tr.appendChild(l2);
  tr.appendChild(l3);

  result_table.appendChild(tr);
}

// const start = new Date();

function updateSet() {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  // const hours = 2;
  // const minutes = 5;
  // const seconds = Math.floor((currentDate.getSeconds() + currentDate.getMilliseconds() / 1000) * 4) % 30;
  // const hours = 8;
  // const minutes = 42;
  // const seconds = 40;

  $('#element1').text(hours);
  $('#element2').text(',' + minutes);
  $('#element3').text(',' + seconds);
  $('#subtraction-set span').each((index, element) => {
    if ($(element).text() === '0' || $(element).text() === ',0') {
      $(element).addClass('zero-value');
    } else {
      $(element).removeClass('zero-value');
    }
  });
  updateInfo();
}

function gcd(a, b) {
  if (b == 0) {
    return a;
  }

  return gcd(b, a % b);
}

function uniq(array) {
  return array.filter((elem, index, self) => self.indexOf(elem) === index);
}

function updateInfo() {
  const element1 = parseInt($('#element1').text());
  const element2 = parseInt($('#element2').text().slice(1));
  const element3 = parseInt($('#element3').text().slice(1));
  const grundySet = [element1, element2, element3].filter((element) => { return element > 0; });
  console.log(grundySet);
  const periodSummary = calcPeriod(grundySet);
  console.log(calcPeriod(grundySet));

  let summary = `period:${periodSummary.period}`;
  summary += ` pre-period:${periodSummary.prePeriod}`;
  summary += ` bit-period:${periodSummary.bitPeriod}`;
  summary += ` pre-pit-period:${periodSummary.preBitPeriod}`;
  console.log(summary);
  $('#summary').text(summary);

  type = 0;

  if (grundySet.length == 0) {
    $('#pre-period').text('none');
    $('#period').text('none');
  } else {
    const sequence = updateButton(grundySet, periodSummary.prePeriod + periodSummary.period);
    const prePeriod = sequence.slice(0, periodSummary.prePeriod);
    const period = sequence.slice(periodSummary.prePeriod);
    console.log(sequence);
    const prePeriodText = prePeriod.join(',');
    if (prePeriodText === '') {
      $('#pre-period').text('none');
    } else {
      $('#pre-period').text(prePeriod.join(','));
    }
    $('#period').text(period.join(','));

    if (uniq(grundySet).length == 3) {
      grundySet.sort((a, b) => { return a - b; });
      const a = grundySet[0];
      const b = grundySet[1];
      const c = grundySet[2];
      const j = (b - a) % (2 * a);
      const p = period.length;
      if (c == a + b && p == b + c - j) {
        type = 1;
      } else if (c == a + b && p == a*(b+c+j-2*a)/gcd(a,2*a-j)) {
        type = 2;
      } else if (p == gcd(a+b, gcd(b+c, c+a))) {
        type = 3;
      } else if (p == gcd(a+b, b+c)) {
        type = 4;
      } else if (p == gcd(a+b, c+a)) {
        type = 5;
      } else if (p == gcd(b+c, c+a)) {
        type = 6;
      } else if (p == a+b) {
        type = 7;
      } else if (p == b+c) {
        type = 8;
      } else if (p == c+a) {
        type = 9;
      }
    }
    if (type > 0) {
      $('#type').text('分類番号' + type);
    } else {
      $('#type').text('分類番号なし: 2要素以下');
    }
    $('body').css('background-color', colors[type]);
  }
}

$(function(){
  setInterval(updateSet, 100);
});
