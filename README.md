# Orflie Onboarding Form

Formulario de onboarding da Orflie pronto para publicar no GitHub Pages e registrar respostas em Google Sheets via Google Apps Script.

## Estrutura

- `index.html`: formulario e logica de envio.
- `config.js`: URL do Google Apps Script.
- `google-apps-script/Code.gs`: script para gravar as respostas na planilha.

## O que voce precisa

- Uma conta Google com acesso ao Google Sheets.
- Um repositorio no GitHub.
- A URL do Web App publicado no Google Apps Script.

## Passo a passo

1. Crie uma planilha no Google Sheets.
2. Na planilha, abra `Extensoes > Apps Script`.
3. Apague o codigo padrao e cole o conteudo de `google-apps-script/Code.gs`.
4. Salve o projeto.
5. No Apps Script, clique em `Implantar > Nova implantacao`.
6. Escolha `Aplicativo da web`.
7. Em `Quem tem acesso`, selecione `Qualquer pessoa`.
8. Implante e copie a URL gerada.
9. Abra `config.js` e substitua `COLE_AQUI_A_URL_DO_WEB_APP` pela URL do Apps Script.
10. Publique este projeto no GitHub.
11. Ative o GitHub Pages apontando para a branch principal e a raiz do repositorio.
12. Envie a URL publica do GitHub Pages para os clientes.

## Como subir no GitHub

```powershell
git init
git add .
git commit -m "feat: onboarding form with google sheets integration"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

## Como os dados ficam salvos

Cada envio cria uma nova linha na planilha com:

- data/hora do envio;
- nome da empresa;
- nome do contato;
- e-mail;
- telefone;
- segmento;
- payload JSON completo com todas as respostas.

Isso permite comecar rapido agora e, se quiser, depois integrar o sistema interno lendo esse JSON ou evoluindo o Apps Script para colunas mais detalhadas.

## Observacoes

- O HTML original estava com texto corrompido em alguns pontos. O projeto aplica uma correcao em tempo de execucao para o navegador exibir o texto corretamente.
- O envio usa um `iframe` oculto para evitar bloqueios de CORS em hospedagem estatica.
- Se quiser depois, o proximo passo natural e trocar o GitHub Pages por Vercel/Netlify ou ligar esse mesmo payload a um backend proprio.
