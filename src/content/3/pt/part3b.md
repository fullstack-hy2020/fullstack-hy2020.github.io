---
mainImage: ../../../images/part-3.svg
part: 3
letter: b
lang: pt
---

<div class="content">

Em seguida, vamos conectar o front-end que fizemos na [Parte 2](/pt/part2) ao nosso próprio back-end.

Na parte anterior, o front-end permitia requisições da lista de notas do json-server que tínhamos como back-end, a partir do endereço http://localhost:3001/notes.
A estrutura de URL do nosso back-end agora é um pouco diferente, pois as notas podem ser encontradas em http://localhost:3001/api/notes. Vamos alterar o atributo __baseUrl__ no <i>src/services/notes.js</i> assim:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes' //highlight-line

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...

export default { getAll, create, update }
```

Porém, agora a requisição GET do front-end para <http://localhost:3001/api/notes> não funciona por algum motivo:

![requisição GET mostrando erro nas ferramentas do desenvolvedor](../../images/3/3ae.png)

O que está acontecendo aqui? Podemos acessar o back-end através do navegador e do postman sem problemas.

### Política de Mesma Origem e CORS

O problema é uma coisa chamada `Política de Mesma Origem`. A origem de uma URL é definida pela combinação do protocolo (<i>protocol</i>, também conhecido como esquema (<i>scheme</i>)), do nome do host e da porta (<i>port</i>).

```text
http://example.com:80/index.html
  
protocol: http
host: example.com
port: 80
```

Quando você visita um site (ou seja, <http://catwebsites.com>), o navegador emite uma requisição para o servidor em que o site (catwebsites.com) está hospedado. A resposta enviada pelo servidor é um arquivo HTML que pode conter uma ou mais referências a recursos/ativos externos hospedados no mesmo servidor que <i>catwebsites.com</i> está hospedado ou em um site diferente. Quando o navegador vê referência(s) a uma URL no HTML de origem, ele emite uma requisição. Se a requisição for feita usando a URL da qual o HTML de origem foi obtido, o navegador processa a resposta sem problemas. No entanto, se o recurso for obtido usando uma URL que não compartilha a mesma origem (esquema, host, porta) que o HTML de origem, o navegador deverá verificar o cabeçalho de resposta `Access-Control-Allow-origin` (CORS). Se ele contiver `*` ou a URL do HTML de origem, o navegador processará a resposta, caso contrário, o navegador se recusará a processá-la e lançará um erro.
  
A <strong>Política de Mesma Origem</strong> é um mecanismo de segurança implementado pelos navegadores para impedir o sequestro de sessão, entre outras vulnerabilidades de segurança.

Para permitir requisições legítimas de várias origens (requisições a URLs que não compartilham a mesma origem), a W3C criou um mecanismo chamado <strong>CORS</strong> (Compartilhamento de Recursos de Origem Cruzada). De acordo com a [Wikipedia](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing):

> <i>Cross-Origin Resource Sharing ou CORS é um mecanismo que permite que recursos restritos em uma página web sejam recuperados por outro domínio fora do domínio ao qual pertence o recurso que será recuperado. Uma página web pode integrar livremente recursos de diferentes origens, como imagens, folhas de estilo, scripts, iframes e vídeos. Certas "requisições de domínio cruzado", em particular as requisições Ajax, são proibidas por padrão pela política de segurança de mesma origem.</i>

O problema é que, por padrão, o código JavaScript de uma aplicação que é executada em um navegador só pode se comunicar com um servidor na mesma [origem](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) (origin).
Como nosso servidor está em _localhost, porta 3001_, enquanto nosso front-end está em _localhost, porta 3000_, eles não possuem a mesma origem.

Lembre-se de que [Política de Mesma Origem](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) (same-origin policy) e CORS não são específicos de React ou Node. São princípios universais referentes à operação segura de aplicações web.

Podemos permitir requisições de outras <i>origens</i> usando o middleware [cors](https://github.com/expressjs/cors) do Node.

No repositório do seu back-end, instale o <i>cors</i> com o comando...

```bash
npm install cors
```

... use o middleware e permita requisições de todas as origens:

```js
const cors = require('cors')

app.use(cors())
```

E o front-end funciona! No entanto, a funcionalidade para alterar a importância das notas ainda não foi implementada no back-end.

Você pode ler mais sobre o CORS na página da [Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

A configuração de nosso aplicação agora é a seguinte:

![diagrama da aplicação React e do navegador](../../images/3/100.png)

A aplicação React sendo executada no navegador agora obtém os dados do servidor node/express que é executado em <em>localhost:3001</em>.

### A Aplicação na Internet

Agora que toda a pilha (stack) está pronta, vamos mover nossa aplicação para a internet.

Há um número cada vez maior de serviços que podem ser usados para hospedar uma aplicação na internet. Serviços voltados a desenvolvedores (developer-friendly services), como o PaaS (Platform as a Service [Plataforma como Serviço]), cuidam da instalação do ambiente de execução (Node.js, por exemplo) e também podem fornecer vários serviços, como bancos de dados.

Durante uma década, [Heroku](http://heroku.com) dominou a cena PaaS. Infelizmente, o plano gratuito do Heroku acabou em 27 de novembro de 2022. Muitos desenvolvedores ficaram tristes com isso, especialmente estudantes. O Heroku ainda é uma opção viável se você estiver disposto a gastar algum dinheiro. Eles também têm [um programa para estudantes](https://www.heroku.com/students) que fornece alguns créditos gratuitos.

Agora estamos apresentando dois serviços: [Fly.io](https://fly.io/) e [Render](https://render.com/), onde ambos têm um plano gratuito (limitado). O Fly.io é nosso serviço de hospedagem "oficial", pois pode ser usado com certeza também nas Partes 11 e 13 do curso. O Render será bom para as outras partes deste curso, pelo menos.

Observe que, apesar de usar apenas o plano gratuito, o Fly.io <i>pode</i> exigir que você insira suas informações de cartão de crédito. No momento, o Render pode ser usado sem um cartão de crédito.

O Render pode ser um pouco mais fácil de usar, pois não requer a instalação de nenhum software em sua máquina.

Também existem outras opções gratuitas de hospedagem que funcionam bem para este curso, para todas as partes exceto a Parte 11 (CI/CD), que tem um exercício complicado de se fazer em outras plataformas.

Alguns participantes do curso também usaram estes serviços:

- [Railway](https://railway.app/)
- [Cyclic](https://www.cyclic.sh/)
- [Replit](https://replit.com)
- [CodeSandBox](https://codesandbox.io)

Se você conhece outros serviços bons e fáceis de usar para hospedar NodeJS, por favor, nos avise!

Tanto para o Fly.io quanto para o Render, precisamos mudar, no final do arquivo <i>index.js</i>, a definição da porta que nossa aplicação usa:

```js
const PORT = process.env.PORT || 3001  // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port (Servidor em execução na porta) ${PORT}`)
})
```

Agora estamos usando a porta definida na [variável de ambiente](https://en.wikipedia.org/wiki/Environment_variable) _PORT_ ou a porta 3001 se a variável de ambiente _PORT_ estiver indefinida. O Fly.io e o Render configuram a porta da aplicação com base nessa variável de ambiente.

#### Fly.io

<i>Note que pode ser preciso fornecer seu número de cartão de crédito para o Fly.io, mesmo se estiver usando apenas o plano gratuito!</i> Na verdade, houve relatos conflitantes sobre isso. Fato é que alguns alunos deste curso estão usando o Fly.io sem informar as informações do cartão de crédito. No momento, [Render](https://render.com/) pode ser usado sem um cartão de crédito.

Por padrão, todos recebem duas máquinas virtuais gratuitas que podem ser usadas para executar duas aplicações ao mesmo tempo.

Se você decidir usar o [Fly.io](https://fly.io/), comece instalando seu executável _flyctl_ seguindo [este guia](https://fly.io/docs/hands-on/install-flyctl/). Após isso, você deve [criar uma conta Fly.io](https://fly.io/docs/hands-on/sign-up/).

Comece por [autenticar-se](https://fly.io/docs/hands-on/sign-in/) via linha de comando com o comando

```bash
fly auth login
```

*Observação:* se o comando _fly_ não funcionar em sua máquina, você pode tentar a versão mais longa _flyctl_. Por exemplo, ambas as formas do comando funcionam no MacOS.

<i>Se você não conseguir fazer o _flyctl_ funcionar em sua máquina, é possível experimentar o Render (veja a próxima seção), que não requer nada a ser instalado em sua máquina.</i>

Inicializa-se uma aplicação executando o seguinte comando no diretório raiz do aplicação:

```bash
fly launch
```

Dê um nome à aplicação ou deixe que o Fly.io gere um automaticamente. Escolha uma região onde a aplicação será executada. Não crie um banco de dados Postgres e não crie um banco de dados Upstash Redis, pois eles não são necessários.

A última pergunta é "Você gostaria de implantar agora? (Would you like to deploy now?)". Devemos responder "não" porque ainda não estamos prontos.

Fly.io cria um arquivo <i>fly.toml</i> na raiz da sua aplicação onde a mesma é configurada. Para colocar a aplicação em funcionamento, <i>talvez</i> precisemos fazer uma pequena adição na parte [env] da configuração:

```bash
[env]
  PORT = "8080" # adicione isto

[experimental]
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8080 
  processes = ["app"]
```

Agora definimos na parte [env] que a variável de ambiente _PORT_ obterá a porta correta (definida na parte [services]) onde a aplicação deve criar o servidor. Observe que a definição pode já estar lá, mas às vezes ela falta.

Agora estamos prontos para implantar (deploy) a aplicação nos servidores Fly.io. Isso é feito com o seguinte comando:

```bash
fly deploy
```

Se tudo correr bem, a aplicação deverá estar em funcionamento. Você pode abri-la no navegador com o comando

```bash
fly open
```

Depois da configuração inicial, quando o código da aplicação for atualizado, poderá ser implantada na produção com o comando:

```bash
fly deploy
```

Um comando particularmente importante é _fly logs_. Este comando pode ser usado para visualizar os logs do servidor. É melhor manter os logs sempre visíveis!

**Atenção:** Em alguns casos (a causa é até agora desconhecida) executar comandos Fly.io, especialmente no Windows WSL, causou problemas. Se o seguinte comando simplesmente travar...

```bash
flyctl ping -o personal
```

... seu computador não consegue, por algum motivo, se conectar ao Fly.io. Se isso acontecer com você, [aqui](https://github.com/fullstack-hy2020/misc/blob/master/fly_io_problem.md) encontra-se uma possível maneira de resolver o problema.

Se a saída do comando abaixo se parecer com isto...

```bash
$ flyctl ping -o personal
35 bytes from fdaa:0:8a3d::3 (gateway), seq=0 time=65.1ms
35 bytes from fdaa:0:8a3d::3 (gateway), seq=1 time=28.5ms
35 bytes from fdaa:0:8a3d::3 (gateway), seq=2 time=29.3ms
...
```

... então não há problemas de conexão!

#### Render

Este serviço pressupõe que o [login](https://dashboard.render.com/) tenha sido feito com uma conta do GitHub.

Depois de fazer login, vamos criar um novo "Web Service":

![](../../images/3/r1.png)

O repositório da aplicação é então conectado ao Render:

![](../../images/3/r2.png)

A conexão parece exigir que o repositório da aplicação seja público.

A seguir, definiremos as configurações básicas. Se a aplicação <i>não</i> estiver na raiz do repositório, o <i>diretório raiz</i> precisa receber um valor apropriado:

![](../../images/3/r3.png)





^^^^^
### NÃO REVISADO







After this, the app starts up in the Render. The dashboard tells us the app state and the url where the app is running:

![](../../images/3/r4.png)

According to the [documentation](https://render.com/docs/deploys) every commit to GitHub should redeploy the app. For some reason this is not always working.

Fortunately it is also possible to manually redeploy the app:

![](../../images/3/r5.png)

Also the app logs can be seen in the dashboard:

![](../../images/3/r7.png)

We notice now from the logs that the app has been started in the port 10000. The app code gets the right port through the environment variable PORT so it is essential that the file <i>index.js</i> has been updated as follows:

```js
const PORT = process.env.PORT || 3001  // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Frontend production build

So far we have been running React code in <i>development mode</i>. In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on. 

When the application is deployed, we must create a [production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) or a version of the application which is optimized for production. 

A production build of applications created with <i>create-react-app</i> can be created with the command [npm run build](https://github.com/facebookincubator/create-react-app#npm-run-build-or-yarn-build).

Let's run this command from the <i>root of the notes frontend project</i> that we developend in [Part 2](/en/part2).

This creates a directory called <i>build</i> (which contains the only HTML file of our application, <i>index.html</i> ) which contains the directory <i>static</i>. [Minified](<https://en.wikipedia.org/wiki/Minification_(programming)>) version of our application's JavaScript code will be generated in the <i>static</i> directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. All of the code from all of the application's dependencies will also be minified into this single file. 

The minified code is not very readable. The beginning of the code looks like this: 

```js
!function(e){function r(r){for(var n,f,i=r[0],l=r[1],a=r[2],c=0,s=[];c<i.length;c++)f=i[c],o[f]&&s.push(o[f][0]),o[f]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var l=t[i];0!==o[l]&&(n=!1)}n&&(u.splice(r--,1),e=f(f.s=t[0]))}return e}var n={},o={2:0},u=[];function f(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,f),t.l=!0,t.exports}f.m=e,f.c=n,f.d=function(e,r,t){f.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},f.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})
```

### Serving static files from the backend

One option for deploying the frontend is to copy the production build (the <i>build</i> directory) to the root of the backend repository and configure the backend to show the frontend's <i>main page</i> (the file <i>build/index.html</i>) as its main page. 

We begin by copying the production build of the frontend to the root of the backend. With a Mac or Linux computer, the copying can be done from the frontend directory with the command

```bash
cp -r build ../backend
```

If you are using a Windows computer, you may use either [copy](https://www.windows-commandline.com/windows-copy-command-syntax-examples/) or [xcopy](https://www.windows-commandline.com/xcopy-command-syntax-examples/) command instead. Otherwise, simply copy and paste. 

The backend directory should now look as follows:

![bash screenshot of ls showing build directory](../../images/3/27new.png)

To make express show <i>static content</i>, the page <i>index.html</i> and the JavaScript, etc., it fetches, we need a built-in middleware from express called [static](http://expressjs.com/en/starter/static-files.html).

When we add the following amidst the declarations of middlewares
```js
app.use(express.static('build'))
```

whenever express gets an HTTP GET request it will first check if the <i>build</i> directory contains a file corresponding to the request's address. If a correct file is found, express will return it. 

Now HTTP GET requests to the address <i>www.serversaddress.com/index.html</i> or <i>www.serversaddress.com</i> will show the React frontend. GET requests to the address <i>www.serversaddress.com/api/notes</i> will be handled by the backend's code.

Because of our situation, both the frontend and the backend are at the same address, we can declare _baseUrl_ as a [relative](https://www.w3.org/TR/WD-html40-970917/htmlweb.html#h-5.1.2) URL. This means we can leave out the part declaring the server. 

```js
import axios from 'axios'
const baseUrl = '/api/notes' // highlight-line

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

After the change, we have to create a new production build and copy it to the root of the backend repository. 

The application can now be used from the <i>backend</i> address <http://localhost:3001>:

![Notes application screenshot](../../images/3/28new.png)

Our application now works exactly like the [single-page app](/en/part0/fundamentals_of_web_apps#single-page-app) example application we studied in part 0. 

When we use a browser to go to the address <http://localhost:3001>, the server returns the <i>index.html</i> file from the <i>build</i> repository. The summarized contents of the file are as follows: 

```html
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```

The file contains instructions to fetch a CSS stylesheet defining the styles of the application, and two <i>script</i> tags that instruct the browser to fetch the JavaScript code of the application - the actual React application. 

The React code fetches notes from the server address <http://localhost:3001/api/notes> and renders them to the screen. The communications between the server and the browser can be seen in the <i>Network</i> tab of the developer console:

![Network tab of notes application on backend](../../images/3/29new.png)

The setup that is ready for a product deployment looks as follows:

![diagram of deployment ready react app](../../images/3/101.png)

Unlike when running the app in a development environment, everything is now in the same node/express-backend that runs in localhost:3001. When the browser goes to the page, the file <i>index.html</i> is rendered. That causes the browser to fetch the product version of the React app. Once it starts to run, it fetches the json-data from the address localhost:3001/api/notes.

### The whole app to the internet

After ensuring that the production version of the application works locally, commit the production build of the frontend to the backend repository, and push the code to GitHub again.

If you are using Render a push to GitHub <i>might</i> be enough. If the automatic deployment does not work, select the "manual deploy" from the Render dashboard.

In the case of Fly.io the new deployment is done with the command

```bash
fly deploy
```

The application works perfectly, except we haven't added the functionality for changing the importance of a note to the backend yet. 

![screenshot of notes application](../../images/3/30new.png)

Our application saves the notes to a variable. If the application crashes or is restarted, all of the data will disappear. 

The application needs a database. Before we introduce one, let's go through a few things. 

The setup looks like now as follows:

![diagram of react app on heroku with a database](../../images/3/102.png)

The node/express-backend now resides in the Fly.io/Render server. When the root address is accessed, the browser loads and executes the React app that fetches the json-data from the Fly.io/Render server.

###  Streamlining deploying of the frontend 

To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the <i>package.json</i> of the backend repository.

#### Fly.io

The script looks like this

```json
{
  "scripts": {
    // ...
    "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",    
    "logs:prod": "fly logs"
  }
}
```

The script _npm run build:ui_ builds the frontend and copies the production version under the backend repository.  _npm run deploy_ releases the current backend to Fly.io. 

_npm run deploy:full_ combines these two scripts. 

There is also a script _npm run logs:prod_ to show the Fly.io logs.

Note that the directory paths in the script <i>build:ui</i> depend on the location of repositories in the file system.

#### Render

In case of Render, the scripts look like the following

```json
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../frontend && npm run build && cp -r build ../backend",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
  }
}
```

The script _npm run build:ui_ builds the frontend and copies the production version under the backend repository. _npm run deploy:full_ contains also the necessary <i>git</i> commands to update the backend repository. 

Note that the directory paths in the script <i>build:ui</i> depend on the location of repositories in the file system.

>**NB**  On Windows, npm scripts are executed in cmd.exe as the default shell which does not support bash commands. For the above bash commands to work, you can change the default shell to Bash (in the default Git for Windows installation) as follows:

```md
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```

Another option is the use of [shx](https://www.npmjs.com/package/shx).

### Proxy

Changes on the frontend have caused it to no longer work in development mode (when started with command _npm start_), as the connection to the backend does not work. 

![Network dev tools showing a 404 on getting notes](../../images/3/32new.png)

This is due to changing the backend address to a relative URL: 

```js
const baseUrl = '/api/notes'
```

Because in development mode the frontend is at the address <i>localhost:3000</i>, the requests to the backend go to the wrong address <i>localhost:3000/api/notes</i>. The backend is at <i>localhost:3001</i>. 

If the project was created with create-react-app, this problem is easy to solve. It is enough to add the following declaration to the <i>package.json</i> file of the frontend repository. 

```bash
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"  // highlight-line
}
```

After a restart, the React development environment will work as a [proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/). If the React code does an HTTP request to a server address at <i>http://localhost:3000</i> not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at <i>http://localhost:3001</i>. 

Now the frontend is also fine, working with the server both in development- and production mode. 

A negative aspect of our approach is how complicated it is to deploy the frontend. Deploying a new version requires generating a new production build of the frontend and copying it to the backend repository. This makes creating an automated [deployment pipeline](https://martinfowler.com/bliki/DeploymentPipeline.html) more difficult. Deployment pipeline means an automated and controlled way to move the code from the computer of the developer through different tests and quality checks to the production environment. Building a deployment pipeline is the topic of [part 11](https://fullstackopen.com/en/part11) of this course.

There are multiple ways to achieve this (for example placing both backend and frontend code [in the same repository](https://github.com/mars/heroku-cra-node) ) but we will not go into those now. 

In some situations, it may be sensible to deploy the frontend code as its own application. With apps created with create-react-app it is [straightforward](https://github.com/mars/create-react-app-buildpack).

The current backend code can be found on [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3), in the branch <i>part3-3</i>. The changes in frontend code are in <i>part3-1</i> branch of the [frontend repository](https://github.com/fullstack-hy2020/part2-notes/tree/part3-1).

</div>

<div class="tasks">

### Exercises 3.9.-3.11.

The following exercises don't require many lines of code. They can however be challenging, because you must understand exactly what is happening and where, and the configurations must be just right. 

#### 3.9 phonebook backend step9

Make the backend work with the phonebook frontend from the exercises of the previous part. Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17. 

You will probably have to do some small changes to the frontend, at least to the URLs for the backend. Remember to keep the developer console open in your browser. If some HTTP requests fail, you should check from the <i>Network</i>-tab what is going on. Keep an eye on the backend's console as well. If you did not do the previous exercise, it is worth it to print the request data or <i>request.body</i> to the console in the event handler responsible for POST requests. 

#### 3.10 phonebook backend step10

Deploy the backend to the internet, for example to Fly.io or Render. 

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works. 

**PRO TIP:** When you deploy your application to Internet, it is worth it to at least in the beginning keep an eye on the logs of the application **AT ALL TIMES**.

Create a README.md at the root of your repository, and add a link to your online application to it. 

#### 3.11 phonebook full stack

Generate a production build of your frontend, and add it to the internet application using the method introduced in this part. 

**NB** If you use Render, make sure the directory <i>build</i> is not gitignored

Also, make sure that the frontend still works locally (in development mode when started with command _npm start_). 

If you have problems getting the app working make sure that your directory structure matches [the example app](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3).

</div>
