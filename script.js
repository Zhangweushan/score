import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

document.getElementById('gradeForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const exam1 = parseFloat(document.getElementById('exam1').value);
  const exam2 = parseFloat(document.getElementById('exam2').value);
  const exam3 = parseFloat(document.getElementById('exam3').value);
  const daily = parseFloat(document.getElementById('daily').value);
  
  const total = calculateTotal(exam1, exam2, exam3, daily);
  const requiredScoreForExam3 = calculateRequiredExam3Score(exam1, exam2, exam3, daily);
  
  displayResults(exam1, exam2, exam3, daily, total, requiredScoreForExam3);
  createGradeChart([exam1, exam2, exam3, daily]);
});

function calculateTotal(exam1, exam2, exam3, daily) {
  return (exam1 * 0.2) + (exam2 * 0.2) + (exam3 * 0.2) + (daily * 0.4);
}

function calculateRequiredExam3Score(exam1, exam2, exam3, daily) {
  return (60 - (exam1 * 0.2 + exam2 * 0.2 + daily * 0.4 + exam3 * 0.2)) / 0.2;
}

function displayResults(exam1, exam2, exam3, daily, total, requiredScoreForExam3) {
  const resultElement = document.getElementById('result');
  const predictionElement = document.getElementById('prediction');
  const gradeDetailsElement = document.getElementById('gradeDetails');
  const resultsContainer = document.querySelector('.results-container');
  
  // Total score display
  resultElement.innerHTML = `<span>總成績: </span>
    <span class="grade-indicator ${getGradeIndicatorClass(total)}">
      ${total.toFixed(1)} 分
    </span>`;
  
  // Exam 3 score prediction
  if (requiredScoreForExam3 > 100) {
    predictionElement.innerHTML = `
      <span class="grade-indicator grade-danger">
        第三次段考需要成績: 超過100，無法達到總分60。
      </span>`;
  } else if (requiredScoreForExam3 < 0) {
    predictionElement.innerHTML = `
      <span class="grade-indicator grade-success">
        第三次段考需要成績: 已經超過60分。
      </span>`;
  } else {
    predictionElement.innerHTML = `
      <span class="grade-indicator grade-warning">
        第三次段考需要成績: 至少 ${requiredScoreForExam3.toFixed(0)} 分才能超過總分60。
      </span>`;
  }
  
  // Detailed grade breakdown
  gradeDetailsElement.innerHTML = `
    <div>📊 第一次段考: ${exam1.toFixed(1)} 分 (權重 20%)</div>
    <div>📈 第二次段考: ${exam2.toFixed(1)} 分 (權重 20%)</div>
    <div>📝 第三次段考: ${exam3.toFixed(1)} 分 (權重 20%)</div>
    <div>📋 平時成績: ${daily.toFixed(1)} 分 (權重 40%)</div>
  `;
  
  // Animate results container
  resultsContainer.style.opacity = '1';
  resultsContainer.style.transform = 'translateY(0)';
}

function getGradeIndicatorClass(score) {
  if (score >= 60) return 'grade-success';
  if (score >= 50) return 'grade-warning';
  return 'grade-danger';
}

function createGradeChart(grades) {
  const ctx = document.getElementById('gradeChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (window.gradeChart instanceof Chart) {
    window.gradeChart.destroy();
  }
  
  window.gradeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['第一次段考', '第二次段考', '第三次段考', '平時成績'],
      datasets: [{
        label: '成績分佈',
        data: grades,
        backgroundColor: [
          'rgba(74, 144, 226, 0.6)',
          'rgba(52, 152, 219, 0.6)',
          'rgba(46, 204, 113, 0.6)',
          'rgba(241, 196, 15, 0.6)'
        ],
        borderColor: [
          'rgba(74, 144, 226, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}