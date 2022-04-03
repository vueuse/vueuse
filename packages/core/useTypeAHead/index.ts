/**
 * 间隔300ms输入，相同字符，作为单个字符处理。只匹配首字母移动
 * 间隔300ms输入，不同字符，作为单个字符处理。只匹配首字母移动
 * 间隔300ms内输入，相同字符，作为单个字符处理。只匹配首字母移动
 * 间隔300ms内输入，相同字符，作为多个字符处理。从首位匹配对应字符串
 * 上下键能够移动聚焦
 * 只对数字、大小写字符、空格 Backspace
 * 可以禁用,跳过
 * Backspace 只返回当前激活
 */
import type { Ref } from 'vue-demi'
import { isRef } from 'vue-demi'
export interface MDCListTextAndIndex {
  // The text of the item in the original list
  text: string // 原始列表文本
  // The index of the item in the original list
  index: number// text 对应原始列别的索引
  // disabled
  __th_disabled?: boolean // 是否禁用
  // skip
  __th_skip?: boolean // 是否跳过
}

export interface TypeaheadState {
  // Continuous input string c
  typeaheadBuffer: string // 连续输入的字符串缓存
  // The string cache of continuous input will be used for matching during continuous input
  typeaheadBufferInput: string // 连续输入的字符串缓存,在连续输入时，用于匹配
  // Timer. When it exceeds 500ms, it will clear the cache typeahead buffer
  bufferClearTimeout: number // 定时器，当超过500ms，就会清除缓存 typeaheadBuffer
  // Identification of whether the character changes when a single character (initial letter) is input at an interval of 500ms
  firstCharisChange: string // 单个字符(首字母)间隔500ms输入时，字符是否变化的标识
  firstCharActiveInedxInMap: number //
}
const numbers = {
  // If no match is found, - 1 is returned
  UNSET_INDEX: -1, // 未匹配到,则返回 - 1
  // Enter the interval
  TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS: 500, // 输入间隔时间
}
const flag = {
  // disabled
  IS_DISABLED: '__th_disabled', // 是否禁用
  // skip
  IS_SKIP: '__th_skip', // 是否跳过
}
export const KEYBOARD_MAP = {
  Digit1: true,
  Digit2: true,
  Digit3: true,
  Digit4: true,
  Digit5: true,
  Digit6: true,
  Digit7: true,
  Digit8: true,
  Digit9: true,
  Numpad1: true,
  Numpad2: true,
  Numpad3: true,
  Numpad4: true,
  Numpad5: true,
  Numpad6: true,
  Numpad7: true,
  Numpad8: true,
  Numpad9: true,
  Space: true,
  KeyA: true,
  KeyB: true,
  KeyC: true,
  KeyD: true,
  KeyE: true,
  KeyF: true,
  KeyG: true,
  KeyH: true,
  KeyI: true,
  KeyJ: true,
  KeyK: true,
  KeyL: true,
  KeyM: true,
  KeyN: true,
  KeyO: true,
  KeyP: true,
  KeyQ: true,
  KeyR: true,
  KeyS: true,
  KeyT: true,
  KeyU: true,
  KeyV: true,
  KeyW: true,
  KeyX: true,
  KeyY: true,
  KeyZ: true,
  // 以下按键视为不是文本输入，而是用户的特殊操作，需要处理
  Backspace: true,
  ArrowUp: true,
  ArrowDown: true,
}
function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}
function isSupportKey(e: KeyboardEvent): boolean {
  return Object.prototype.hasOwnProperty.call(KEYBOARD_MAP, e.code)
}
/**
 * 初始化生成 TypeaheadState 实例
 * Initialize generation of typeahead state instance
 */
function initState(): TypeaheadState {
  return {
    bufferClearTimeout: 0,
    typeaheadBuffer: '',
    typeaheadBufferInput: '',
    firstCharisChange: '',
    firstCharActiveInedxInMap: 0,
  }
}

/**
 * Initialize index sort function
 * @param listItemCount 原始文本列表长度
 * Original text list length
 * @param typeh initState方法的返回值
 * Return value of initstate function
 */
function initSortedIndex(
  listItemCount: number,
  typeh: TypeAHeadInstance): Map<string, MDCListTextAndIndex[]> {
  const sortedIndexByFirstChar = new Map<string, MDCListTextAndIndex[]>()
  // 根据 listItemCount 遍历原始文本列表
  for (let i = 0; i < listItemCount; i++) {
    // 获取 item 对应的原始文本
    // Traverses the list of original text items based on listcount
    const primaryText = typeh.getOrigin(i, typeh._textKey).trim()
    const isDisabled = !!typeh.getOrigin(i, flag.IS_DISABLED)
    const isSkip = !!typeh.getOrigin(i, flag.IS_SKIP)
    // item是禁用或跳过 ，则跳出本次循环
    // If item is disabled or skipped, you will jump out of this cycle
    if (!primaryText || isDisabled || isSkip)
      continue

    // 原始文本信息和对应索引组装成一个对象，并按照首字母，使用
    // 一个数组存储在map当中 e.g. Map =>[a,[{text:'aaa',index:0}]]
    // The original text information and the corresponding index are assembled into an object,
    // and an array is stored in the map according to the initial letter
    // e.g. Map =>[a,[{text:'aaa',index:0}]]
    const firstChar = primaryText[0].toLowerCase()
    if (!sortedIndexByFirstChar.has(firstChar))
      sortedIndexByFirstChar.set(firstChar, [])

    sortedIndexByFirstChar.get(firstChar)!.push(
      {
        text: primaryText.toLowerCase(),
        index: i,
      })
  }
  // 做一遍排序
  sortedIndexByFirstChar.forEach((values) => {
    values.sort((first: MDCListTextAndIndex, second: MDCListTextAndIndex) => {
      return first.index - second.index
    })
  })
  return sortedIndexByFirstChar
}

/**
 * 判断item是否为跳过或者禁用，会在上下键操作中使用
 * Judge whether the item is skipped or disabled,
 * which will be used in the up and down key operation
 * @param item
 */
function isItemAtIndexDisabledOrSkip(item: any) {
  return item[flag.IS_DISABLED] || item[flag.IS_SKIP]
}

/**
 * 寻找下一个符合条件的item索引，这个方法会在上下键操作中使用
 * Find the next qualified item index.
 * This function will be used in the up and down key operation
 * @param focusedItemIndex 当前聚焦索引
 * Current focus index
 * @param list 原始数据列表
 * Raw data list
 * @param direction 方向，取值为 'down' / 'up'
 * Direction, the value is' down '/'up'
 */
function findNextItemIndex(focusedItemIndex: number, list: MDCListTextAndIndex[], direction: string) {
  let result: number = focusedItemIndex
  // 当前聚焦索引为跳过或者禁用，且按下的是 ArrowDown
  // If the current focus index is skipped or disabled, and you press 'ArrowDown'
  if (isItemAtIndexDisabledOrSkip(list[focusedItemIndex]) && direction === 'down') {
    // 寻找下一个非禁用和非跳过的 item
    // Find the next non disabled and non skipped item
    while (isItemAtIndexDisabledOrSkip(list[result])) {
      result++
      if (result === list.length)
        result = 0
    }
  }
  // 当前聚焦索引为跳过或者禁用，且按下的是 ArrowUp
  // If the current focus index is skipped or disabled, and you press 'ArrowUp'
  if (isItemAtIndexDisabledOrSkip(list[focusedItemIndex]) && direction === 'up') {
    // 寻找下一个非禁用和非跳过的 item
    // // Find the next non disabled and non skipped item
    while (isItemAtIndexDisabledOrSkip(list[result])) {
      result--
      if (result === -1)
        result = list.length - 1
    }
  }
  return result
}
/**
 * 匹配单个字符
 * @param sortedIndexByFirstChar 方法 initSortedIndex 的返回值
 * Return value of function initsortedindex
 * @param focusedItemIndex 当前聚焦索引
 * Current focus index
 * @param state TypeaheadState 实例
 * TypeaheadState instance
 */
function matchFirstChar(
  sortedIndexByFirstChar: Map<string, MDCListTextAndIndex[]>,
  focusedItemIndex: number,
  state: TypeaheadState): number {
  // 从 map 中获取对应首字母的文本信息
  // Get the text information of the corresponding initials from the map
  const firstCharDict = sortedIndexByFirstChar.get(state.typeaheadBuffer)
  if (!firstCharDict) return numbers.UNSET_INDEX
  // 当单个输入字母变化了，重置 focusedItemIndex
  // When a single input letter changes, reset the focuseditemindex
  if (state.firstCharisChange !== state.typeaheadBuffer) {
    state.firstCharActiveInedxInMap = 0
    focusedItemIndex = numbers.UNSET_INDEX
    state.firstCharisChange = state.typeaheadBuffer
  }
  // 用户刚输入第一个字符时，直接返回第一个数组元素
  // When the user just enters the first character, the first array element is returned directly
  if (focusedItemIndex === -1)
    return firstCharDict[0].index

  // 遍历找到 当前激活的位于 firstCharDict 的位置
  let resIndex = numbers.UNSET_INDEX
  for (let i = state.firstCharActiveInedxInMap; i < firstCharDict.length; i++) {
    // 找到上一次匹配的位置，下移一个索引
    // Find the last matching position and move down one index
    if (firstCharDict[i].index === focusedItemIndex) {
      // 设置新的索引，如果是最后一个，则返回第一个
      if (i === firstCharDict.length - 1)
        state.firstCharActiveInedxInMap = 0
      else
        state.firstCharActiveInedxInMap = i + 1

      // 返回最终结果索引
      resIndex = firstCharDict[state.firstCharActiveInedxInMap].index
      break
    }
  }
  return resIndex
}

/**
 * 匹配多个字符串
 * Match multiple strings
 * @param sortedIndexByFirstChar 方法 initSortedIndex 的返回值
 * Return value of function initsortedindex
 * @param focusedItemIndex 当前聚焦索引
 * Current focus index
 * @param state TypeaheadState 实例
 * TypeaheadState instance
 */
function matchAllChars(
  sortedIndexByFirstChar: Map<string, MDCListTextAndIndex[]>,
  focusedItemIndex: number,
  state: TypeaheadState): number {
  // 取到字符的首个字母，找到对应map存储的数组
  // Get the first letter of the character and find the array stored in the corresponding map
  const firstChar = state.typeaheadBuffer[0]
  // step1:如果连续输入同一个字符
  // step1:If you enter the same character continuously
  if (uniq(state.typeaheadBuffer.split('')).length === 1) {
    state.typeaheadBuffer = firstChar
    return matchFirstChar(sortedIndexByFirstChar, focusedItemIndex, state)
  }
  // 根据字符串的首个字母，找到对应map存储的数组
  // Get the text information of the corresponding initials from the map
  const firstCharDict = sortedIndexByFirstChar.get(firstChar)
  if (!firstCharDict) return numbers.UNSET_INDEX
  let resIndex = numbers.UNSET_INDEX
  // 遍历找到符合的索引
  // Traversal to find a matching index
  for (let i = 0; i < firstCharDict.length; i++) {
    // 这里使用 typeaheadBufferInput 进行匹配，因为 typeaheadBuffer 在 step1 中
    // 被改变了，它的值可能和用户输入的不一致了
    // Here, typeahead buffer input is used for matching,
    // because typeahead buffer is changed in step 1,
    // and its value may be inconsistent with the user's input
    if (firstCharDict[i].text.indexOf(state.typeaheadBufferInput) === 0) {
      resIndex = firstCharDict[i].index
      break
    }
  }
  return resIndex
}

class TypeAHeadInstance {
  // Raw data list
  private _list: [] // 原始数据列表
  // Key of the text field of item in the Raw data list
  public _textKey: string // 原始数据列表 item中 文本的建
  // TypeaheadState instance
  public _state: TypeaheadState // TypeaheadState 实例
  // Return value of function initsortedindex
  public sortedIndexMapByFirstChar: Map<string, MDCListTextAndIndex[]> = new Map() // 方法 initSortedIndex 的返回值
  // Current focus index
  public focusedItemIndex = numbers.UNSET_INDEX // 当前聚焦索引
  public ctx = this
  constructor(list: [], textKey: string) {
    this._list = list
    this._textKey = textKey
    this._state = initState()
  }

  /**
   * 从原始数据列表中获取值方法
   * function to get value from raw data list
   * @param index 索引
   * @param key 访问的键
   */
  getOrigin(index: number, key: string): string {
    return this._list[index][key]
  }

  /**
   * 匹配方法
   * Matching function
   */
  public match = () => {
    return this.matchItem()
  }

  /**
   * 匹配 item 方法
   * Match item function
   */
  public matchItem = () => {
    const _this = this.ctx
    return function(e: KeyboardEvent) {
      // 只对支持的按键响应
      // Respond only to supported keys
      if (!isSupportKey(e))
        return numbers.UNSET_INDEX
      // 获取按下的键盘按键值
      // Gets the value of the keyboard key pressed
      const nextChar = e.key.toLowerCase()
      clearTimeout(_this._state.bufferClearTimeout)
      _this._state.bufferClearTimeout = window.setTimeout(() => {
        clearBuffer(_this._state)
      }, numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS)
      // 处理 Backspace
      // handle 'Backspace'
      if (e.code === 'Backspace')
        return _this.focusedItemIndex
      // 处理 ArrowDown
      // handle 'ArrowDown'
      if (e.code === 'ArrowDown') {
        _this.focusedItemIndex = _this.focusedItemIndex + 1
        _this.focusedItemIndex = (_this.focusedItemIndex > (_this._list.length - 1)) ? 0 : _this.focusedItemIndex
        _this.focusedItemIndex = findNextItemIndex(_this.focusedItemIndex, _this._list, 'down')
        return _this.focusedItemIndex
      }
      // 处理 ArrowUp
      // handle 'ArrowUp'
      if (e.code === 'ArrowUp') {
        _this.focusedItemIndex = _this.focusedItemIndex - 1
        _this.focusedItemIndex = _this.focusedItemIndex < 0 ? _this._list.length - 1 : _this.focusedItemIndex
        _this.focusedItemIndex = findNextItemIndex(_this.focusedItemIndex, _this._list, 'up')
        return _this.focusedItemIndex
      }
      // 根据 nextChar 生成新匹配字符串
      // Generate a new matching string based on 'nextchar'
      _this._state.typeaheadBuffer = _this._state.typeaheadBuffer + nextChar
      _this._state.typeaheadBufferInput = _this._state.typeaheadBufferInput + nextChar
      let index: number
      if (_this._state.typeaheadBuffer.length === 1) {
        // 如果用户输入的只有一个字符，我们就匹配首字母
        index = matchFirstChar(_this.sortedIndexMapByFirstChar, _this.focusedItemIndex, _this._state)
      }
      else {
        index = matchAllChars(_this.sortedIndexMapByFirstChar, _this.focusedItemIndex, _this._state)
      }
      _this.focusedItemIndex = index
      return index
    }
  }
}

/**
 * 清除缓存
 * clearBuffer
 * @param state TypeaheadState 实例
 * TypeaheadState instance
 */
function clearBuffer(state: TypeaheadState) {
  state.typeaheadBuffer = ''
  state.typeaheadBufferInput = ''
}

/**
 * useTypeAHead 主函数
 * useTypeAHead main function
 * @param list 原始数据列表
 * Raw data list
 * @param textKey 原始数据列表 item中 文本的建
 * Key of the text field of item in the Raw data list
 */
export function useTypeAHead(list: [] | Ref, textKey: string) {
  const originList = isRef(list) ? list.value : list
  const len = originList.length
  const typeAHead = new TypeAHeadInstance(originList, textKey)
  typeAHead.sortedIndexMapByFirstChar = initSortedIndex(len, typeAHead)
  return typeAHead
}
