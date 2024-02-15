---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: fr
---

<div class="content">

Jusqu'à présent, nous avons suivi les conventions de gestion d'état recommandées par React. Nous avons placé l'état et les fonctions pour le gérer dans un [niveau supérieur](https://react.dev/learn/sharing-state-between-components) de la structure des composants de l'application. Assez souvent, la majeure partie de l'état de l'application et les fonctions modifiant l'état résident directement dans le composant racine. L'état et ses méthodes de gestion ont ensuite été passés à d'autres composants avec les props. Cela fonctionne jusqu'à un certain point, mais lorsque les applications grandissent, la gestion de l'état devient un défi.

### Architecture Flux

Il y a déjà quelques années, Facebook a développé l'architecture [Flux](https://facebookarchive.github.io/flux/docs/in-depth-overview) pour faciliter la gestion de l'état des applications React. Dans Flux, l'état est séparé des composants React et placé dans ses propres <i>stores</i>.
L'état dans le store n'est pas modifié directement, mais avec différentes <i>actions</i>.

Lorsqu'une action change l'état du store, les vues sont rerendues:

![diagramme action->dispatcher->store->vue](../../images/6/flux1.png)

Si une action dans l'application, par exemple appuyer sur un bouton, nécessite de changer l'état, le changement est réalisé avec une action.
Cela provoque à nouveau le rerendu de la vue:

![même diagramme que ci-dessus mais avec l'action bouclant en arrière](../../images/6/flux2.png)

Flux offre une manière standard de comment et où l'état de l'application est conservé et comment il est modifié.

### Redux

Facebook a une implémentation pour Flux, mais nous utiliserons la bibliothèque [Redux](https://redux.js.org). Elle fonctionne sur le même principe mais est un peu plus simple. Facebook utilise maintenant également Redux au lieu de leur Flux original.

Nous allons apprendre à connaître Redux en implémentant à nouveau une application de compteur:

![application de compteur dans le navigateur](../../images/6/1.png)

Créez une nouvelle application Vite et installez </i>redux</i> avec la commande

```bash
npm install redux
```



</div>