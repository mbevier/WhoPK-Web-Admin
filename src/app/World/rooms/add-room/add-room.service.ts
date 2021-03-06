import {
    Validators,
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/items/interfaces/item.interface';
import { BehaviorSubject } from 'rxjs';
import { Mob } from 'src/app/mobs/interfaces/mob.interface';
import { Room } from '../interfaces/room.interface';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class RoomService {
    private host = `${environment.hostAPI}`;
    private saveRoomUrl = `${this.host}World/Room/`;

    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

    items: BehaviorSubject<Item[]> = new BehaviorSubject([]);
    mobs: BehaviorSubject<Mob[]> = new BehaviorSubject([]);
    public addRoomForm = this.formBuilder.group({
        id: [''],
        title: ['', Validators.required],
        description: ['', Validators.required],
        roomObjects: this.formBuilder.array([this.initRoomObject()]),
        updateMessage: [''],
        instantRepop: [false],
        mobs: [],
        CoordX: ['', Validators.required],
        CoordY: ['', Validators.required],
        CoordZ: ['', Validators.required],
        exits: this.formBuilder.group({
            north: [''],
            northEast: [''],
            east: [''],
            southEast: [''],
            south: [''],
            southWest: [''],
            west: [''],
            northWest: [''],
            up: [''],
            down: ['']

        }),



    });

    // return this.formBuilder.group({
    //     emote: ''
    // });

    initRoomObject() {
        return this.formBuilder.group({
            name: new FormControl(''),
            look: new FormControl(''),
            examine: new FormControl(''),
            touch: new FormControl(''),
            smell: new FormControl(''),
            taste: new FormControl(''),
        });


    }

    roomItemsUpdate(item: Item) {
        console.log('item: ', item);
        const foundIndex = this.items.getValue().findIndex(x => x.id === item.id);

        const newArr = this.items.getValue();
        newArr[foundIndex] = item;


        console.log('item in arr: ', newArr[foundIndex]);
        this.items.next(JSON.parse(JSON.stringify(this.items.getValue())));
        // return item;
    }

    roomItems(item: Item) {
        this.items.next([...this.items.getValue(), item]);

        // return item;
    }

    clearCache() {
        this.items.next([]);
        this.mobs.next([]);
        this.addRoomForm.reset();
        this.addRoomForm.get('exits.northWest').setValue('')
        this.addRoomForm.get('exits.north').setValue('')
        this.addRoomForm.get('exits.northEast').setValue('')
        this.addRoomForm.get('exits.west').setValue('')
        this.addRoomForm.get('exits.east').setValue('')
        this.addRoomForm.get('exits.southWest').setValue('')
        this.addRoomForm.get('exits.south').setValue('')
        this.addRoomForm.get('exits.southEast').setValue('')
        this.addRoomForm.get('exits.up').setValue('')
        this.addRoomForm.get('exits.down').setValue('')
    }
    getRroomItems() {
        console.log(this.items);
    }

    updateMobInventory(item: Item, mob: Item | Mob) {

        const foundIndex = this.mobs.getValue().findIndex(x => x.id === mob.id);

        const newArr = this.mobs.getValue();
        newArr[foundIndex].inventory.push(item);

        this.mobs.next(JSON.parse(JSON.stringify(this.mobs.getValue())));


    }


    roomMobs(mob: Mob) {

        this.mobs.next([...this.mobs.getValue(), mob]);

    }

    saveRoom(data: Room) {
        return this.http.post(this.saveRoomUrl, JSON.stringify(data),
            { headers: this.headers, responseType: 'text' }).pipe(
                tap(x => console.log(x))
            ).subscribe();

    }
    updateRoom(data: Room) {
        return this.http.put(`${this.saveRoomUrl}/${data.id}`, JSON.stringify(data),
            { headers: this.headers, responseType: 'text' }).pipe(
                tap(x => console.log(x))
            ).subscribe();

    }

    removeExit(exit: string) {
        this.addRoomForm.get('exits.north').setValue('')
    }

}
