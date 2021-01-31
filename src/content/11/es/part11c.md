---
mainImage: ../../../images/part-11.svg
part: 11
letter: c
lang: es
---

<div class="content">

Habiendo escrito una buena aplicación, es hora de pensar sobre cómo vamos a implementarlo para el uso de usuarios reales.

En la [parte 3](/en/part3/deploying_app_to_internet) de este curso, lo hicimos simplemente <i>enviando el repositorio git</i> a los servidores del proveedor de la nube [Heroku](https://www.heroku.com/home). Es bastante simple lanzar software en Heroku al menos en comparación con muchos otros tipos de configuraciones de alojamiento, pero aún conlleva riesgos: nada nos impide introducir accidentalmente código roto en producción.

A continuación, veremos los principios para realizar una implementación de forma segura y algunos de los principios para implementar software tanto a pequeña como a gran escala.

### Cualquier cosa que pueda salir mal...

Nos gustaría definir algunas reglas sobre cómo debería funcionar nuestro proceso de implementación, pero antes de eso, tenemos que ver algunas limitaciones de la realidad.

Un parafraseo de la Ley de Murphy sostiene que:
"Todo lo que pueda salir mal, saldrá mal".

Es importante recordar esto cuando planificamos nuestro sistema de implementación. Algunas de las cosas que tendremos que considerar podrían incluir:

- ¿Qué pasa si mi PC falla o se cuelga durante la implementación?
- Estoy conectado al servidor y estoy implementando a través de Internet, ¿qué sucede si mi conexión a Internet se interrumpe?
- ¿Qué sucede si falla alguna instrucción específica en mi script/sistema de implementación?
- ¿Qué sucede si, por cualquier motivo, mi software no funciona como se esperaba en el servidor en el que estoy implementando? ¿Puedo volver a una versión anterior?
- ¿Qué sucede si un usuario realiza una solicitud HTTP a nuestro software justo antes de la implementación (no tuvimos tiempo de enviar una respuesta al usuario)?

Estas son solo una pequeña selección de lo que puede salir mal durante una implementación, o más bien, cosas que debemos planificar. Independientemente de lo que suceda, nuestro sistema de implementación **nunca** debe dejar nuestro software en un estado roto. También deberíamos saber siempre (o poder averiguar fácilmente) en qué estado se encuentra una implementación.

Otra regla importante a recordar cuando se trata de implementaciones (y CI en general) es:
"¡Los fallos silenciosos son **muy** malos!"

Esto no significa que las fallas deban mostrarse a los usuarios del software, significa que debemos estar al tanto si algo sale mal. Si somos conscientes de un problema, podemos solucionarlo, si el sistema de implementación no da ningún error pero falla, podemos terminar en un estado en el que creemos que hemos solucionado un error crítico pero la implementación falló, dejando el error. en nuestro entorno de producción y nosotros desconocemos la situación.

### ¿Qué hace un buen sistema de implementación?

Definir reglas o requisitos definitivos para un sistema de implementación es difícil, intentemos de todos modos:

- Nuestro sistema de implementación debería poder fallar correctamente en **cualquier** paso de la implementación.
- Nuestro sistema de implementación **nunca** debe dejar nuestro software en un estado roto.
- Nuestro sistema de implementación debe informarnos cuando se produce una falla. Es más importante notificar sobre el fracaso que sobre el éxito.
- Nuestro sistema de implementación debería permitirnos retroceder a una implementación anterior
  - Preferiblemente, esta reversión debería ser más fácil de hacer y menos propensa a fallas que una implementación completa
  - Por supuesto, la mejor opción sería una reversión automática en caso de fallas de implementación
- Nuestro sistema de implementación debe manejar la situación en la que un usuario realiza una solicitud HTTP justo antes o durante una implementación.
- Nuestro sistema de implementación debe asegurarse de que el software que estamos implementando cumpla con los requisitos que hemos establecido para esto (por ejemplo, no lo implemente si no se han realizado las pruebas).

Definamos algunas cosas que **queremos** en este sistema de implementación hipotético también:

- Nos gustaría que fuera rápido
- Nos gustaría que no haya tiempo de inactividad durante la implementación (esto es distinto del requisito que tenemos para manejar las solicitudes de los usuarios justo antes/durante el despliegue).

</div>

<div class="tasks">

### Ejercicios 11.10-11.12.

Antes de pasar a los ejercicios siguientes, debe configurar su aplicación en el entorno Heroku como lo hicimos en la [parte 3](/en/part3/deploying_app_to_internet#application-to-the-internet).

En contraste con la parte 3, ahora <i>no enviamos el código</i> a Heroku nosotros mismos, ¡dejamos que el flujo de trabajo de Acciones de Github lo haga por nosotros!

Asegúrese ahora de tener [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) instalado e inicie sesión en Heroku usando la CLI con <code>heroku login</code>.

Cree una nueva aplicación en Heroku usando la CLI: <code>heroku create --region eu {your\_app\_name}</code>, elija una [región](https://devcenter.heroku.com/articles/regions) cerca de su propia ubicación.

Genere un token de API para su perfil de Heroku usando el comando <code>heroku authorizations:create</code> y guarde las credenciales en un archivo local, pero <i>**¡no las envíe a GitHub**</i>!

Pronto necesitará el token para su flujo de trabajo de implementación. Consulte más información sobre los tokens de Heroku [aquí](https://devcenter.heroku.com/articles/platform-api-quickstart).

#### 11.10 Implementación de su aplicación en Heroku

Amplíe el flujo de trabajo con un paso para implementar su aplicación en Heroku.

A continuación, se asume que utiliza la acción de implementación de Heroku lista para usar [AkhileshNS/heroku-deploy](https://github.com/AkhileshNS/heroku-deploy) que ha sido desarrollada por la comunidad.

Necesita el token de autorización que acaba de crear para la implementación. La forma correcta de pasar su valor a las acciones de GitHub es usar los secretos del repositorio:

![Secreto del repositorio](../../images/11/10.png)

Ahora el flujo de trabajo puede acceder al valor del token de la siguiente manera:

```
${{secrets.HEROKU_API_KEY}}
```

Si todo va bien, su registro de flujo de trabajo debería verse un poco así:

![](../../images/11/11.png)

Luego puede probar la aplicación con un navegador, pero lo más probable es que tenga un problema. Si leemos detenidamente [la sección 'Aplicación a Internet' en la parte 3](/es​​/part3/deploying_app_to_internet#application-to-the-internet) notamos que Heroku asume que el repositorio tiene un archivo llamado <i>Procfile< / i> que le dice a Heroku cómo iniciar la aplicación.

Por lo tanto, agregue un Procfile adecuado y asegúrese de que la aplicación se inicie correctamente.

**Recuerde** que siempre es esencial estar atento a lo que sucede en los registros del servidor cuando se juega con las implementaciones de productos, así que use <code>heroku logs</code> con anticipación y utilícelo con frecuencia. No, úsalo todo el tiempo.

#### 11.11 Comprobación de estado

Antes de continuar, ampliemos el flujo de trabajo con un paso más, una verificación que garantice que la aplicación está en funcionamiento después de la implementación.

En realidad, no se necesita un paso de flujo de trabajo separado, ya que la acción
[deploy-to-heroku](https://github.com/marketplace/actions/deploy-to-heroku) contiene una opción que se encarga de ello.

Agregue un endpoint simple para realizar una verificación de estado de la aplicación en el backend. Por ejemplo, puede copiar este código:

```js
app.get('/health', (req, res) => {
  res.send('ok')
})
```

También podría ser una buena idea tener un punto final ficticio en la aplicación que permite realizar algunos cambios en el código y garantizar que la versión implementada haya cambiado realmente:

```js
app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
})
```

Mira ahora en la [documentación](https://github.com/marketplace/actions/deploy-to-heroku) cómo incluir la verificación de estado en el paso de implementación. Utilice el extremo creado para la URL de verificación de estado. Lo más probable es que también necesite la opción <i>checkstring</i> para que la verificación funcione.

Asegúrese de que Actions notifique si una implementación interrumpe su aplicación. Puede simular esto, por ejemplo, escribiendo un comando de inicio incorrecto en Procfile:

![](../../images/11/12a.png)

Antes de pasar al siguiente ejercicio, corrija su implementación y asegúrese de que la aplicación vuelva a funcionar correctamente.

#### 11.12. Retroceder

Si la implementación da como resultado una aplicación rota, lo mejor que puede hacer es <i>retroceder</i> a la versión anterior. Afortunadamente, Heroku lo hace bastante fácil. Cada implementación en Heroku da como resultado una [versión](https://blog.heroku.com/releases-and-rollbacks#releases). Puede ver las versiones de su aplicación con el comando <code>heroku releases</code>:

```js
$ heroku releases
=== cicdtest222 Releases - Current: v29
v29  Deploy 7fff7150  mluukkai@iki.fi  2020/12/05 18:22:32 +0200
v28  Deploy 764c37d4  mluukkai@iki.fi  2020/12/05 18:09:04 +0200
v27  Deploy 1467d514  mluukkai@iki.fi  2020/12/05 16:28:52 +0200
v26  Deploy ec0ea68b  mluukkai@iki.fi  2020/12/05 15:39:31 +0200
v25  Deploy a8a88aff  mluukkai@iki.fi  2020/12/05 15:34:55 +0200
v24  Deploy d0f3ae58  mluukkai@iki.fi  2020/12/05 15:31:45 +0200
v23  Deploy a348f651  mluukkai@iki.fi  2020/12/05 15:28:19 +0200
v22  Deploy 254d24d4  mluukkai@iki.fi  2020/12/05 14:27:33 +0200
v21  Deploy 950f5403  mluukkai@iki.fi  2020/12/05 14:24:44 +0200
v20  Deploy 9d51da28  mluukkai@iki.fi  2020/12/05 14:22:20 +0200
```

Se puede hacer rápidamente una [reversión](https://blog.heroku.com/releases-and-rollbacks#rollbacks) a una versión con un solo comando desde la línea de comandos.

Lo que es aún mejor, es que la acción [deploy-to-heroku](https://github.com/marketplace/actions/deploy-to-heroku) puede encargarse de la reversión por nosotros.

Así que vuelve a leer la [documentación](https://github.com/marketplace/actions/deploy-to-heroku) y modifica el flujo de trabajo para evitar una implementación rota por completo. Puede volver a simular una implementación interrumpida rompiendo el archivo Procfile:!

[](../../images/11/13.png)

Asegúrese de que la aplicación siga funcionando a pesar de una implementación interrumpida.

Tenga en cuenta que a pesar de la operación de reversión automática, la compilación falla y cuando esto sucede en la vida real es <i>esencial</i> encontrar la causa del problema y solucionarlo rápidamente. Como de costumbre, el mejor lugar para comenzar a descubrir la causa del problema es estudiar los registros de Heroku:

![](../../images/11/14.png)

</div>
