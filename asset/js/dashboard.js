document.addEventListener('DOMContentLoaded', function () {

  /* ==================== ANIMATED STAT COUNTERS ==================== */
  var counters = document.querySelectorAll('.dash-stat-num');
  if (counters.length) {
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target) || target === 0) return;

      var isLarge = target > 10000;
      var duration = 1800;
      var start = performance.now();

      function formatNum(n) {
        if (isLarge) {
          if (n >= 1000000000) return 'Rp' + (n / 1000000000).toFixed(1) + 'M';
          if (n >= 1000000) return 'Rp' + (n / 1000000).toFixed(1) + 'jt';
          return 'Rp' + n.toLocaleString('id-ID');
        }
        return n.toLocaleString('id-ID');
      }

      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatNum(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  /* ==================== BAR CHART ==================== */
  var chartEl = document.getElementById('dashChart');
  if (chartEl) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    var values = [65, 40, 80, 55, 90, 70, 95, 60, 75, 85, 50, 45];
    var maxVal = Math.max.apply(null, values);

    months.forEach(function (m, i) {
      var group = document.createElement('div');
      group.className = 'dash-bar-group';

      var bar = document.createElement('div');
      bar.className = 'dash-bar';
      bar.style.height = '0%';
      bar.title = m + ': ' + values[i] + ' pesanan';

      var label = document.createElement('span');
      label.className = 'dash-bar-label';
      label.textContent = m;

      group.appendChild(bar);
      group.appendChild(label);
      chartEl.appendChild(group);

      setTimeout(function () {
        bar.style.height = (values[i] / maxVal * 100) + '%';
      }, 200 + i * 80);
    });
  }

});
