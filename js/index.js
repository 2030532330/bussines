// 获取DOM元素
const elements = {
  departureTime: document.getElementById('departureTime'),
  arrivalTime: document.getElementById('arrivalTime'),
  departureLocation: document.getElementById('departureLocation'),
  arrivalLocation: document.getElementById('arrivalLocation'),
  travelMode: document.getElementById('jt'),
  passengerCount: document.getElementById('passengerCount'),
  remarksSection: document.querySelector('.remarksSection'),
  remarks: document.getElementById('remarks'),
  resultContainer: document.getElementById('resultContainer'),
  resultContent: document.getElementById('resultContent'),
  copyButton: document.getElementById('copyBtn'),
  submitButton: document.getElementById('submitBtn'),
  resetButton: document.getElementById('resetBtn'),
  timeDisplay: document.getElementById('timeDisplay')
};

// 用于存储上次提交的内容
let lastSubmittedContent = '';

// 日期格式化函数
function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('zh-CN', options).replace(/\//g, '-');
}

// 时间格式化函数
function getFormattedTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekday = weekdays[now.getDay()];

  return {
    timeString: `${year}年${month}月${day}日${hours}时${minutes}分${seconds}秒 ${weekday}`,
    hoverTitle: `${year}年${month}月${day}日 ${weekday}`
  };
}

// 更新时间显示
function updateTime() {
  const { timeString, hoverTitle } = getFormattedTime();
  elements.timeDisplay.textContent = timeString;
  elements.timeDisplay.title = hoverTitle;
}

// 初始化时间显示
updateTime();
setInterval(updateTime, 1000);

// 显示或隐藏备注输入框
function toggleRemarksSection() {
  const passengerCountValue = parseInt(elements.passengerCount.value, 10);
  elements.remarksSection.style.display = passengerCountValue > 1 ? 'flex' : 'none';
  if (passengerCountValue <= 1) {
    elements.remarks.value = '';
  }
}

// 验证日期格式和逻辑
function validateDates() {
  const { departureTime, arrivalTime } = elements;

  if (!departureTime.value || !arrivalTime.value) {
    return true; // 让必填验证处理
  }

  const depDate = new Date(departureTime.value);
  const arrDate = new Date(arrivalTime.value);

  if (isNaN(depDate.getTime()) || isNaN(arrDate.getTime())) {
    alert('请输入有效的日期格式');
    return false;
  }

  if (depDate > arrDate) {
    alert('出发日期不能晚于到达日期');
    return false;
  }

  return true;
}

// 计算天数差
function calculateDaysDifference(depDate, arrDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((arrDate - depDate) / oneDay) + 1; // 包含当天
}

// 格式化日期为中文
function formatDateChinese(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

// 格式化文本内容
function formatContent(depDate, arrDate) {
  // 获取表单元素值
  const {
    departureLocation,
    arrivalLocation,
    travelMode,
    passengerCount,
    remarks
  } = elements;

  // 格式化日期
  const depTimeFormatted = formatDateChinese(depDate);
  const arrTimeFormatted = formatDateChinese(arrDate);
  const diffDays = calculateDaysDifference(depDate, arrDate);

  let result = `${depTimeFormatted}至${arrTimeFormatted} `;
  result += `${diffDays}天${travelMode.value} `;
  result += `${departureLocation.value}到${arrivalLocation.value} `;
  result += `${passengerCount.value}人`;

  if (remarks.value.trim()) {
    result += `  同行人：${remarks.value}`;
  }

  return result;
}

// 显示复制成功反馈
function showCopySuccess() {
  const originalText = elements.copyButton.innerHTML;
  elements.copyButton.innerHTML = '✓ 复制成功';
  elements.copyButton.style.backgroundColor = '#34a853';

  setTimeout(() => {
    elements.copyButton.innerHTML = originalText;
    elements.copyButton.style.backgroundColor = '';
  }, 2000);
}

// 显示复制失败并提供手动复制选项
function showCopyFallback(text) {
  const modal = document.createElement('div');
  modal.className = 'copy-fallback-modal';

  const box = document.createElement('div');
  box.className = 'copy-fallback-box';
  box.innerHTML = '<h3>复制失败，请手动复制以下内容</h3>';

  const textarea = document.createElement('textarea');
  textarea.className = 'copy-fallback-textarea';
  textarea.value = text;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'copy-fallback-close-btn';
  closeBtn.textContent = '关闭';

  box.append(textarea, closeBtn);
  modal.appendChild(box);
  document.body.appendChild(modal);

  textarea.select();

  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}

// 提交处理
function handleSubmit() {
  const passengerCountValue = parseInt(elements.passengerCount.value, 10);

  if (isNaN(passengerCountValue)) {
    alert('请输入有效的人数');
    elements.passengerCount.focus();
    return;
  }

  if (!elements.departureTime.value || !elements.arrivalTime.value ||
    !elements.departureLocation.value || !elements.arrivalLocation.value) {
    alert('请填写所有必填字段');
    return;
  }

  if (!validateDates()) return;

  const depDate = new Date(elements.departureTime.value);
  const arrDate = new Date(elements.arrivalTime.value);
  const textContent = formatContent(depDate, arrDate);

  if (textContent === lastSubmittedContent) {
    alert('您已经提交过相同的内容，请勿重复提交！');
    return;
  }

  lastSubmittedContent = textContent;
  elements.resultContainer.style.display = 'block';
  elements.resultContent.textContent = textContent;
  elements.resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// 重置处理
function handleReset() {
  elements.departureTime.value = '';
  elements.arrivalTime.value = '';
  elements.departureLocation.value = '';
  elements.arrivalLocation.value = '';
  elements.travelMode.value = '高铁';
  elements.passengerCount.value = '1';
  elements.remarks.value = '';
  elements.resultContent.textContent = '';
  elements.resultContainer.style.display = 'none';
  elements.remarksSection.style.display = 'none';
}

// 复制处理
async function handleCopy() {
  const textToCopy = elements.resultContent.textContent;

  try {
    await navigator.clipboard.writeText(textToCopy);
    showCopySuccess();
  } catch (err) {
    console.log('现代API失败，尝试备用方法:', err);
    try {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        showCopySuccess();
      } else {
        showCopyFallback(textToCopy);
      }
    } catch (err) {
      console.log('备用方法也失败:', err);
      showCopyFallback(textToCopy);
    }
  }
}

// 事件监听
function initEventListeners() {
  // 人数输入变化
  elements.passengerCount.addEventListener('input', toggleRemarksSection);

  // 人数验证
  elements.passengerCount.addEventListener('change', function () {
    const value = parseInt(this.value, 10);
    if (isNaN(value) || value <= 0) {
      this.value = 1;
      alert('人数必须大于0');
    }
  });

  // 日期选择器覆盖点击
  document.querySelectorAll('.date-input-overlay').forEach(overlay => {
    overlay.addEventListener('click', function () {
      this.previousElementSibling.focus();
      this.previousElementSibling.showPicker();
    });
  });

  // 按钮事件
  elements.submitButton.addEventListener('click', handleSubmit);
  elements.resetButton.addEventListener('click', handleReset);
  elements.copyButton.addEventListener('click', handleCopy);
}

// 初始化
function init() {
  // 设置今天为默认出发日期
  const today = new Date().toISOString().split('T')[0];
  elements.departureTime.value = today;

  // 初始化事件监听
  initEventListeners();
}

// 启动应用
init();