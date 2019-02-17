import { Item } from '../items/interfaces/item.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class Shared {

 compareOptions(obj: Item, obj2: Item ): boolean {
        return obj.uuid === obj2.uuid;
    }

  }