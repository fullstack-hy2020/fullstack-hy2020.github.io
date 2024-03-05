---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: fr
---

<div class="content">

En plus des huit exercices dans les sections [React Router](/fr/part7/react_router) et [Hooks personnalisés](/fr/part7/hooks_personnalises) de cette septième partie du matériel de cours, 13 exercices continuent notre travail sur l'application Bloglist sur laquelle nous avons travaillé dans les parties quatre et cinq du matériel de cours. Certains des exercices suivants sont des "fonctionnalités" indépendantes les unes des autres, ce qui signifie qu'il n'est pas nécessaire de finir les exercices dans un ordre particulier. Vous êtes libre de sauter une partie des exercices si vous le souhaitez. Assez nombreux parmi les exercices appliquent la technique avancée de gestion d'état (Redux, React Query et contexte) couverte dans la [partie 6](/fr/part6).

Si vous ne souhaitez pas utiliser votre application Bloglist, vous êtes libre d'utiliser le code de la solution modèle comme point de départ pour ces exercices.

Beaucoup des exercices dans cette partie du matériel de cours nécessiteront la refonte du code existant. C'est une réalité commune de l'extension des applications existantes, ce qui signifie que la refonte est une compétence importante et nécessaire même si elle peut sembler difficile et désagréable parfois.

Un bon conseil pour à la fois la refonte et l'écriture de nouveau code est de faire des <i>petits pas</i>. Perdre la raison est presque garanti si vous laissez l'application dans un état complètement cassé pendant de longues périodes lors de la refonte.

</div>

<div class="tasks">

### Exercices 7.9.-7.21.

#### 7.9 : formatage automatique du code

Dans les parties précédentes, nous avons utilisé ESLint pour garantir que le code suit les conventions définies. [Prettier](https://prettier.io/) est une autre approche pour le même objectif. Selon la documentation, Prettier est <i>un formateur de code opinionné</i>, c'est-à-dire que Prettier ne contrôle pas seulement le style du code mais formate également le code selon la définition.

Prettier est facile à intégrer dans l'éditeur de code de sorte que lorsque le code est enregistré, il est automatiquement formaté correctement.

Utilisez Prettier dans votre application et configurez-le pour qu'il fonctionne avec votre éditeur.

### Gestion d'état : Redux

<i>Il y a deux versions alternatives à choisir pour les exercices 7.10-7.13 : vous pouvez gérer l'état de l'application soit en utilisant Redux soit React Query et Context</i>. Si vous souhaitez maximiser votre apprentissage, vous devriez faire les deux versions!

#### 7.10 : Redux, étape1

Refactorez l'application pour utiliser Redux pour gérer les données de notification.

#### 7.11 : Redux, étape2

<i>Notez</i> que cet exercice et les deux suivants sont assez laborieux mais incroyablement éducatifs.

Stockez les informations sur les articles de blog dans le store Redux. Dans cet exercice, il suffit que vous puissiez voir les blogs dans le backend et créer un nouveau blog.

Vous êtes libre de gérer l'état pour la connexion et la création de nouveaux articles de blog en utilisant l'état interne des composants React.

#### 7.12 : Redux, étape3

Étendez votre solution pour qu'il soit à nouveau possible de liker et supprimer un blog.

#### 7.13 : Redux, étape4
Stockez les informations sur l'utilisateur connecté dans le store Redux.

### Gestion d'état : React Query et contexte

<i>Il y a deux versions alternatives à choisir pour les exercices 7.10-7.13 : vous pouvez gérer l'état de l'application soit en utilisant Redux soit React Query et Context</i>.

#### 7.10 : React Query et contexte, étape1

Refactorez l'application pour utiliser le hook useReducer et le contexte pour gérer les données de notification.

#### 7.11 : React Query et contexte, étape2

Utilisez React Query pour gérer l'état des blogs. Pour cet exercice, il suffit que l'application affiche les blogs existants et que la création d'un nouveau blog soit réussie.

Vous êtes libre de gérer l'état pour la connexion et la création de nouveaux articles de blog en utilisant l'état interne des composants React.

#### 7.12 : React Query et contexte, étape3

Étendez votre solution pour qu'il soit à nouveau possible de liker et supprimer un blog.

#### 7.13 : React Query et contexte, étape4

Utilisez le hook useReducer et le contexte pour gérer les données de l'utilisateur connecté.

### Vues

Le reste des tâches est commun aux versions Redux et React Query.

#### 7.14 : Vue des utilisateurs

Implémentez une vue dans l'application qui affiche toutes les informations de base liées aux utilisateurs:

![navigateur blogs avec tableau des utilisateurs montrant les blogs créés](../../images/7/41.png)

#### 7.15 : Vue d'utilisateur individuel

Implémentez une vue pour les utilisateurs individuels qui affiche tous les articles de blog ajoutés par cet utilisateur :

![navigateur blogs montrant les blogs ajoutés par l'utilisateur](../../images/7/44.png)

Vous pouvez accéder à la vue en cliquant sur le nom de l'utilisateur dans la vue qui liste tous les utilisateurs:

![navigateur blogs montrant les utilisateurs cliquables](../../images/7/43.png)

<i>**NB:**</i> vous rencontrerez presque certainement le message d'erreur suivant durant cet exercice:

![navigateur TypeError cannot read property name of undefined'](../../images/7/42ea.png)

Le message d'erreur se produira si vous actualisez la page d'un utilisateur individuel.

La cause du problème est que, lorsque nous naviguons directement vers la page d'un utilisateur individuel, l'application React n'a pas encore reçu les données du backend. Une solution pour résoudre le problème est d'utiliser le rendu conditionnel:

```js
const User = () => {
  const user = ...
  // highlight-start
  if (!user) {
    return null
  }
  // highlight-end

  return (
    <div>
      // ...
    </div>
  )
}
```

#### 7.16 : Vue du blog

Implémentez une vue séparée pour les articles de blog. Vous pouvez modéliser la mise en page de votre vue d'après l'exemple suivant:

![navigateur blogs montrant un seul blog via l'URL /blogs/number](../../images/7/45.png)

Les utilisateurs devraient pouvoir accéder à la vue en cliquant sur le nom de l'article de blog dans la vue qui liste tous les articles de blog.

![navigateur montrant que les blogs sont cliquables](../../images/7/46.png)

Une fois que vous avez terminé cet exercice, la fonctionnalité implémentée dans l'exercice 5.7 n'est plus nécessaire. Cliquer sur un article de blog ne doit plus étendre l'élément dans la liste et afficher les détails de l'article de blog.

#### 7.17 : Navigation

Implémentez un menu de navigation pour l'application:

![navigateur blogs navigation menu de navigation](../../images/7/47.png)

#### 7.18 : commentaires, étape1

Implémentez la fonctionnalité permettant de commenter les articles de blog:

![navigateur blogs montrant la liste des commentaires pour un blog](../../images/7/48.png)

Les commentaires doivent être anonymes, c'est-à-dire qu'ils ne sont pas associés à l'utilisateur qui a laissé le commentaire.

Dans cet exercice, il suffit que le frontend affiche seulement les commentaires que l'application reçoit du backend.

Un mécanisme approprié pour ajouter des commentaires à un article de blog serait une requête HTTP POST vers le point de terminaison <i>api/blogs/:id/comments</i>.

#### 7.19 : commentaires, étape2

Étendez votre application pour que les utilisateurs puissent ajouter des commentaires aux articles de blog depuis le frontend:

![navigateur montrant des commentaires ajoutés via le frontend](../../images/7/49.png)

#### 7.20 : Styles, étape1

Améliorez l'apparence de votre application en appliquant l'une des méthodes présentées dans le matériel de cours.

#### 7.21 : Styles, étape2

Vous pouvez marquer cet exercice comme terminé si vous utilisez une heure ou plus pour styliser votre application.

C'était le dernier exercice de cette partie du cours et il est temps de pousser votre code sur GitHub et de marquer tous vos exercices terminés dans le [système de soumission des exercices](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>