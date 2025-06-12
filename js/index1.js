
// 获取元素
const departureTime = document.getElementById('departureTime');
const arrivalTime = document.getElementById('arrivalTime');
const departureLocation = document.getElementById('departureLocation');
const arrivalLocation = document.getElementById('arrivalLocation');
const travelMode = document.getElementById('jt');
const passengerCount = document.getElementById('passengerCount');
const remarksSection = document.querySelector('.remarksSection');
const remarks = document.getElementById('remarks');
const resultContainer = document.getElementById('resultContainer');
const resultContent = document.getElementById('resultContent');
const copyButton = document.getElementById('copyBtn');
const submitButton = document.getElementById('submitBtn');
const resetButton = document.getElementById('resetBtn');

// 用于存储上次提交的内容
let lastSubmittedContent = '';

// 日期格式化函数
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('zh-CN', options).replace(/\//g, '-');
}
// 初始化时间显示
function updateTime() {
    const now = new Date();

    // 获取年月日时分秒
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    // 获取星期几（0=周日，1=周一，...，6=周六）
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const weekday = weekdays[now.getDay()];

    // 格式化时间字符串
    const timeString = `${year}年${month}月${day}日${hours}时${minutes}分${seconds}秒 ${weekday}`;

    // 悬浮提示内容（仅年月日 + 星期）
    const hoverTitle = `${year}年${month}月${day}日 ${weekday}`;

    // 更新页面显示和悬停提示
    const timeElement = document.getElementById('timeDisplay');
    timeElement.textContent = timeString;
    timeElement.title = hoverTitle; // 悬浮仅显示年月日和星期

    // 更新页面显示
    document.getElementById('timeDisplay').textContent = timeString;
}

// 初始加载时立即更新时间
updateTime();
// 每秒更新一次时间
setInterval(updateTime, 1000);

// 显示或隐藏备注输入框
function toggleRemarksSection() {
    const passengerCountValue = parseInt(passengerCount.value, 10);
    remarksSection.style.display = passengerCountValue > 1 ? 'flex' : 'none';
    if (passengerCountValue <= 1) {
        remarks.value = ''; // 清空备注
    }
}

// 验证日期格式和逻辑
function validateDates() {
    const departureTimeValue = departureTime.value;
    const arrivalTimeValue = arrivalTime.value;

    if (!departureTimeValue || !arrivalTimeValue) {
        return true; // 让必填验证处理
    }

    const depDate = new Date(departureTimeValue);
    const arrDate = new Date(arrivalTimeValue);

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

// 修改后的格式化文本内容函数
function formatContent(depDate, arrDate) {
    const departureLocationValue = departureLocation.value;
    const arrivalLocationValue = arrivalLocation.value;
    const travelModeValue = travelMode.value;
    const passengerCountValue = parseInt(passengerCount.value, 10);
    const remarksValue = remarks.value;

    // 格式化日期为"YYYY年MM月DD日"
    const formatDateChinese = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}年${month}月${day}日`;
    };

    const depTimeFormatted = formatDateChinese(depDate);
    const arrTimeFormatted = formatDateChinese(arrDate);
    const diffDays = calculateDaysDifference(depDate, arrDate);

    // 构建最终格式
    let result = `${depTimeFormatted}至${arrTimeFormatted} `;
    result += `${diffDays}天${travelModeValue} `;
    result += `${departureLocationValue}到${arrivalLocationValue} `;
    result += `${passengerCountValue}人`;

    // 添加备注(如果有)
    if (remarksValue && remarksValue.trim() !== '') {
        result += `  同行人：${remarksValue}`;
    }

    return result;
}

// 提交按钮事件
submitButton.addEventListener('click', function () {
    // 获取人数值并转换为整数
    const passengerCountValue = parseInt(passengerCount.value, 10);

    // 验证人数
    if (isNaN(passengerCountValue)) {
        alert('请输入有效的人数');
        passengerCount.focus();
        return;
    }
    // 实时验证人数输入
    passengerCount.addEventListener('change', function () {
        const value = parseInt(this.value, 10);
        if (isNaN(value) || value <= 0) {
            this.value = 1; // 自动重置为1
            alert('人数必须大于0');
        }
    });
    // 验证必填字段
    if (!departureTime.value || !arrivalTime.value ||
        !departureLocation.value || !arrivalLocation.value) {
        alert('请填写所有必填字段');
        return;
    }

    if (!validateDates()) {
        return;
    }

    const depDate = new Date(departureTime.value);
    const arrDate = new Date(arrivalTime.value);
    const textContent = formatContent(depDate, arrDate);

    if (textContent === lastSubmittedContent) {
        alert('您已经提交过相同的内容，请勿重复提交！');
        return;
    }

    lastSubmittedContent = textContent;
    resultContainer.style.display = 'block';
    resultContent.textContent = textContent;

    // 平滑滚动到结果
    resultContainer.scrollIntoView({ behavior: 'smooth' });
});

// 重置按钮事件
resetButton.addEventListener('click', function () {
    departureTime.value = '';
    arrivalTime.value = '';
    departureLocation.value = '';
    arrivalLocation.value = '';
    travelMode.value = '高铁';
    passengerCount.value = '1';
    remarks.value = '';
    resultContent.textContent = '';
    resultContainer.style.display = 'none';
    remarksSection.style.display = 'none';
});

// 复制按钮事件 - 使用现代Clipboard API
// 复制按钮事件处理
copyButton.addEventListener('click', async function () {
    const textToCopy = resultContent.textContent;

    try {
        // 方法1: 现代Clipboard API (首选)
        await navigator.clipboard.writeText(textToCopy);
        showCopySuccess();
    } catch (err) {
        console.log('现代API失败，尝试备用方法:', err);

        try {
            // 方法2: 使用document.execCommand作为备用
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';  // 避免滚动到元素位置
            textarea.style.opacity = '0';      // 隐藏元素
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
});

// 显示复制成功反馈
function showCopySuccess() {
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = '✓ 复制成功';
    copyButton.style.backgroundColor = '#34a853';

    setTimeout(() => {
        copyButton.innerHTML = originalText;
        copyButton.style.backgroundColor = '';
    }, 2000);
}

// 显示复制失败并提供手动复制选项
function showCopyFallback(text) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    const box = document.createElement('div');
    box.style.backgroundColor = 'white';
    box.style.padding = '20px';
    box.style.borderRadius = '8px';
    box.style.maxWidth = '80%';

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.width = '100%';
    textarea.style.height = '150px';
    textarea.style.margin = '15px 0';
    textarea.style.padding = '10px';
    textarea.style.border = '1px solid #ddd';
    textarea.style.borderRadius = '4px';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.marginTop = '10px';
    closeBtn.style.backgroundColor = '#f44336';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.cursor = 'pointer';

    box.innerHTML = '<h3>复制失败，请手动复制以下内容</h3>';
    box.appendChild(textarea);
    box.appendChild(closeBtn);
    modal.appendChild(box);
    document.body.appendChild(modal);

    textarea.select();

    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// 监听人数输入框，动态显示或隐藏备注输入框
passengerCount.addEventListener('input', toggleRemarksSection);

// 添加点击事件处理
document.querySelectorAll('.date-input-overlay').forEach(overlay => {
    overlay.addEventListener('click', function () {
        this.previousElementSibling.focus();
        this.previousElementSibling.showPicker();
    });
});
// 设置今天为默认出发日期
const today = new Date().toISOString().split('T')[0];
departureTime.value = today;