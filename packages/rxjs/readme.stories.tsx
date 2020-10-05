import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../_docs/showdocs'
import { useObservable } from './useObservable'
import { fromEvent } from './from'
import { of, forkJoin } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { take, mergeMap, concatAll, pluck, map, scan } from 'rxjs/operators'

type Post = {
  id: number
  userId: number
  title: string
}
type User = {
  username: string
}
type Comment = {
  body: string
}
type JoinedPost = {
  username: string
  comments: number
  id: string
}

const Demo = defineComponent({
  setup() {
    const BASE_URL = 'https://jsonplaceholder.typicode.com'
    const button = ref<HTMLButtonElement>(null)
    const posts = useObservable(fromEvent(button, 'click').pipe(
      mergeMap(() => ajax.getJSON<Post[]>(`${BASE_URL}/posts`).pipe(
        concatAll(),
        take(4),
        mergeMap(({ id, userId, title }) => forkJoin({
          id: of(id),
          comments: ajax.getJSON<Comment[]>(`${BASE_URL}/posts/${id}/comments`).pipe(
            map(comments => comments.length),
          ),
          username: ajax.getJSON<User>(`${BASE_URL}/users/${userId}`).pipe(
            pluck('username'),
          ),
        }), 2),
        scan((acc, curr) => [...acc, curr], [] as JoinedPost[]),
      )),
    ))
    return {
      posts,
      button,
    }
  },

  render(this: Vue & {posts: JoinedPost[]; update: any}) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./README.md')} />
    const posts = this.posts?.map((post, idx) =>
      <li key={idx} style={{ width: '25%', display: 'inline-block' }}>
        <div><b>id: </b>{post.id}</div>
        <div><b>Username: </b>{post.username}</div>
        <div><b>Total comments: </b>{post.comments}</div>
      </li>
    ) ?? 'waiting...'
    return (
      <div>
        {Docs}
        <div id="demo">
          <button ref="button">start</button>
          <ul>
            {posts}
          </ul>
        </div>
      </div>
    )
  },
})

storiesOf('Add-ons|Rxjs', module)
  .add('Read Me', () => Demo as any)
