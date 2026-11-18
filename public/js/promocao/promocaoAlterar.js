
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-editar-promocao').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.getElementById('edit_id_promocao').value = btn.dataset.id || '';
        document.getElementById('edit_descricao').value = btn.dataset.descricao || '';
        document.getElementById('edit_percentual_desconto').value = btn.dataset.desconto || '';
        document.getElementById('edit_ativo').value = btn.dataset.ativo || 'S';
      });
    });

    document.getElementById('formEditarPromocao').addEventListener('submit', function (e) {
      e.preventDefault();

      var dados = {
        id_promocao: document.getElementById('edit_id_promocao').value,
        descricao: document.getElementById('edit_descricao').value.trim(),
        percentual_desconto: document.getElementById('edit_percentual_desconto').value,
        ativo: document.getElementById('edit_ativo').value
      };

      fetch('/promocoes/editar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.ok) {
          location.reload();
        } else {
          alert(res.msg || 'Erro ao editar promoção.');
        }
      })
      .catch(function () { alert('Erro de comunicação com o servidor.'); });
    });
  });
