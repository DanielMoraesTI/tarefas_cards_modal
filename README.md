
# ListaTarefasCardModal

Projeto frontend desenvolvido em TypeScript para gestão de utilizadores, tarefas e tags, com foco nesta branch na integração com backend via API REST.

## Nome de quem realizou o projeto

Daniel Moraes
UpSkill 218

## Link do repositório GitHub

https://github.com/DanielMoraesTI/tarefas_cards_modal.git

## Observação importante sobre a branch

Este README refere-se à branch m5-usar-API-Backend.

Para utilizar esta versão do projeto, deve usar a branch m5-usar-API-Backend e não a main, porque a main pode ter estrutura, ficheiros e comportamento diferentes desta implementação.

## Objetivo desta branch

Esta versão do projeto foi ajustada para trabalhar com backend, deixando de depender apenas de dados fictícios em memória.

O objetivo principal foi integrar o frontend com serviços HTTP para:

- carregar utilizadores do backend
- carregar tarefas do backend
- carregar e relacionar tags com tarefas
- criar, editar e remover utilizadores e tarefas usando a API

## Estrutura principal ligada ao backend

### Pasta api

Na pasta src/api estão os ficheiros responsáveis por comunicar diretamente com o backend:

- apiUserService.ts: chamadas HTTP relacionadas com utilizadores
- apiTaskService.ts: chamadas HTTP relacionadas com tarefas
- apiTagService.ts: chamadas HTTP relacionadas com tags
- apiCommentService.ts: reservado para comentários, ainda sem implementação nesta branch

Estes ficheiros centralizam o uso de fetch para a API em http://localhost:3000.

### Serviços principais

Além da pasta api, três ficheiros ficaram centrais nesta integração:

- userService.ts: recebe os dados do apiUserService e transforma os dados em objetos usados pela aplicação
- taskService.ts: carrega tarefas do backend, faz sincronização local da lista e trata operações de criação, atualização e remoção
- TagService.ts: usa o apiTagService para obter, criar, adicionar e remover tags ligadas às tarefas

De forma simples, o fluxo funciona assim:

UI -> services -> api -> backend

Ou seja, a interface chama os services, os services organizam a lógica da aplicação e os ficheiros da pasta api fazem a comunicação com o servidor.

## Principais funcionalidades nesta branch

- listagem de utilizadores a partir do backend
- criação de utilizadores a partir do frontend
- alteração de estado de utilizadores
- listagem de tarefas a partir do backend
- criação, edição e remoção de tarefas
- filtro de tarefas por título, utilizador e estado
- carregamento e associação de tags às tarefas
- atualização da interface após operações feitas no backend

## Passos para executar o código

### 1. Clonar o repositório

```bash
git clone https://github.com/DanielMoraesTI/tarefas_cards_modal.git
```

### 2. Entrar na pasta do projeto

```bash
cd tarefas_cards_modal
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Gerar os ficheiros compilados

```bash
npm run build
```

Se quiser acompanhar alterações automaticamente durante desenvolvimento:

```bash
npm run watch
```

### 5. Garantir que o backend está em execução

Esta branch espera um backend disponível em:

```text
http://localhost:3000
```

Sem esse backend, as funcionalidades principais de utilizadores, tarefas e tags não irão carregar corretamente.

### 6. Abrir a aplicação

Depois da compilação, basta abrir o ficheiro index.html no navegador.

O ficheiro HTML carrega o script compilado em dist/main.js.

## Principais decisões tomadas e justificação da adequação

### 1. Separar a comunicação HTTP na pasta api

Decisão:
Criar ficheiros próprios para utilizadores, tarefas e tags.

Justificação:
Esta separação torna o código mais simples de entender, porque cada ficheiro fica responsável por um conjunto específico de endpoints. Também facilita manutenção e testes futuros.

### 2. Manter os services entre a interface e a API

Decisão:
Usar userService.ts, taskService.ts e TagService.ts como camada intermediária.

Justificação:
Isto evita que a interface faça chamadas HTTP diretamente. Assim, a UI fica mais organizada e a lógica principal fica concentrada nos services.

### 3. Converter dados recebidos do backend para o formato usado pela aplicação

Decisão:
Transformar os dados vindos da API em objetos e listas usados internamente no frontend.

Justificação:
Esta abordagem mantém compatibilidade com a estrutura que o projeto já tinha antes da integração com backend, reduzindo mudanças bruscas no restante código.

### 4. Manter parte do estado ainda em memória

Decisão:
Alguns elementos auxiliares, como comentários e anexos, continuam locais nesta fase.

Justificação:
Como estudante, esta decisão foi adequada para avançar por etapas: primeiro integrar utilizadores, tarefas e tags, e depois evoluir os restantes módulos.

### 5. Compilar TypeScript para dist

Decisão:
Manter o código-fonte em src e a saída compilada em dist.

Justificação:
Isto organiza melhor o projeto, separando o código editável do código executado no navegador.

## Observações finais

Esta branch representa uma etapa de evolução do projeto, saindo de uma abordagem mais estática para uma abordagem integrada com backend.

O foco principal foi tornar utilizadores, tarefas e tags funcionais com API, mantendo o código simples e compreensível para fins académicos.

### Autor

[@DanielMoraesTI](https://github.com/DanielMoraesTI)

## Licença

Projeto de carácter educacional e académico.
Livre para estudo, adaptação e melhoria.