/**
 * 控制流程状态样式
 * @param {*} num 当前进行到第几步，0为第一步查看购物车
 */
function setFlow(num) {
  var doms = Array.from(document.querySelector(".flow").getElementsByTagName("li"));
  doms.map((item, index) => {
    if (num === index) {
      return item.className = "active";
    } else {
      return item.className = "";
    }

  })
}
setFlow(0)

/**
 * 获取选中按钮
 * @returns
 */
function getInfos() {
  var listDoms = Array.from(document.querySelector(".shop-list").getElementsByTagName("li"));
  var checkedDoms = [];
  var subDoms = [];
  var addDoms = [];
  var numDoms = [];
  var unitPriceDoms = [];
  var subPriceDoms = [];
  var scoreDoms = [];
  var removeDoms = [];
  listDoms.forEach((item, index) => {
    var checked = item.querySelector("input[type='checkbox']");
    var sub = item.querySelector(".sub");
    var add = item.querySelector(".add");
    var num = item.querySelector(".count-num");
    var unitPrice = item.querySelector(".unit-price");
    var subPrice = item.querySelector(".sub-total");
    var score = item.querySelector(".score");
    var remove = item.querySelector(".remove");
    checkedDoms.push(checked);
    subDoms.push(sub);
    addDoms.push(add);
    numDoms.push(num);
    unitPriceDoms.push(unitPrice);
    subPriceDoms.push(subPrice);
    scoreDoms.push(score);
    removeDoms.push(remove);
  })
  return {
    listDoms,
    checkedDoms,
    subDoms,
    addDoms,
    numDoms,
    unitPriceDoms,
    subPriceDoms,
    scoreDoms,
    removeDoms,
    len: listDoms.length
  }
}

/**
 * 设置选中样式
 * @returns
 */
function setChecked() {
  var doms = Array.from(document.querySelector(".shop-list").getElementsByTagName("li"));
  doms.map((item, index) => {
    var input = item.querySelector("input[type='checkbox']");
    if (input.checked) {
      return item.classList.add("checked")
    } else {
      return item.classList.remove("checked")
    }
  })
}

/**
 * 是否全选
 * @returns
 */
function isCheckedAll() {
  var inputs = getInfos().checkedDoms;
  var checkedAll = inputs.every(item => {
    return item.checked;
  })
  if (checkedAll) { //全选
    document.querySelector(".shop-title").getElementsByTagName("input")[0].checked = true;
  } else { //非全选
    document.querySelector(".shop-title").getElementsByTagName("input")[0].checked = false;
  }
}

/**
 * 更新价格
 */
function updatePrice(infos, j, count){
  var value = +infos.numDoms[j].value + count;
  if(value < 1){
    value = 1;
  }
  infos.numDoms[j].value = value;
  infos.subPriceDoms[j].innerText = (infos.unitPriceDoms[j].innerText * value).toFixed(2);
  if (infos.checkedDoms[j].checked) {
    setAccountEvent();
  }
}

/**
 * 小计
 * @param {*} infos
 * @param {*} j
 */
function setPriceEvent(infos, j) {
  infos.subDoms[j].onclick = function () {
    updatePrice(infos, j, -1);
  }
  infos.addDoms[j].onclick = function () {
    updatePrice(infos, j, 1)
  }
}

/**
 * 删除
 * @param {*} infos
 * @param {*} j
 */
function setRemoveEvent(infos, j) {
  infos.removeDoms[j].onclick = function () {
    infos.listDoms[j].remove();
  }
}
/**
 * 计算总价、总积分
 */
function setAccountEvent() {
  var infos = getInfos();
  var scoreAllDom = document.querySelector(".shop-account").querySelector(".score");
  var priceAllDom = document.querySelector(".shop-account").querySelector(".price");
  var score = 0;
  var price = 0;
  infos.checkedDoms.forEach((item, index) => {
    if (item.checked) {
      score += infos.scoreDoms[index].innerText * infos.numDoms[index].value;
      price += +infos.subPriceDoms[index].innerText;
    }
  })
  scoreAllDom.innerText = score;
  priceAllDom.innerText = price.toFixed(2);
}

/**
 * 绑定选中按钮点击事件，切换对应样式
 * @returns
 */
function bindClickEvent() {
  var infos = getInfos();
  for (var i = 0; i < infos.len; i++) {
    infos.checkedDoms[i].onclick = function () {
      setChecked();
      isCheckedAll();
      setAccountEvent();
    }
    setPriceEvent(infos, i);
    updatePrice(infos, i, 0);
    setRemoveEvent(infos, i);
  }

  //全选按钮事件
  var checkedAllDom = document.querySelector(".shop-title").getElementsByTagName("input")[0];
  checkedAllDom.parentElement.onclick = function () {
    infos.checkedDoms.forEach(item => {
      item.checked = checkedAllDom.checked;
      setChecked();
    })
    setAccountEvent();
  }

  //批量删除
  var removeAllDom = document.querySelector(".shop-account").querySelector(".remove");
  removeAllDom.onclick = function(){
    infos.checkedDoms.forEach((item, index)=>{
      if(item.checked){
        infos.listDoms[index].remove();
      }
    })
  }
}
bindClickEvent();

