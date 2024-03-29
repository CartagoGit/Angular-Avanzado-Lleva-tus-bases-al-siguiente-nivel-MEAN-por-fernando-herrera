import {
	Component,
	ComponentRef,
	ElementRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import {
	ModalState,
	ModalOptions,
} from '../../interfaces/models/modal.interface';
import { ModalService } from '../../services/settings/modal.service';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
	// ANCHOR - Variables
	@ViewChild('modalContent', { read: ViewContainerRef })
	content?: ViewContainerRef;

	@ViewChild('backdrop') backdrop?: ElementRef<HTMLDivElement>;

	public componentRef?: ComponentRef<any>;

	public options?: ModalOptions;

	// ANCHOR - Constructor
	constructor(public modalSvc: ModalService) {}

	ngAfterViewInit(): void {
		// * Asigna el contenedor del modal al servicio
		this.modalSvc.assignContainerModal(this);
	}

	// ANCHOR - Methods

	/**
	 * ? Incrusta un componente dentro del modal
	 * @public
	 * @template C
	 * @param {ModalState<C>} state
	 * @returns {boolean}
	 */
	public createChildComponent<C>(state: ModalState<C>): boolean {
		if (!this.content) return false;
		const { component, data, options } = state;
		this.options = options;
		this.content.clear();
		this.componentRef = this.content.createComponent(component);
		//!! La data se recupera y es un parametro exclusivo al crear la instancia del modal
		// if (this.componentRef?.instance?.data)
		if (data) this.componentRef.instance.data = data;

		this.content.insert(this.componentRef.hostView);
		return true;
	}

	/**
	 * ? Elimina el componente hijo del modal
	 * @public
	 */
	public removeChildComponent(): void {
		if (!this.content) return;
		this.content.clear();
	}

	/**
	 *  ? Cierra el modal
	 * @public
	 */
	public close(): void {
		if (this.componentRef?.instance?.close)
			this.componentRef.instance.close();
		else this.modalSvc.close();
	}

	/**
	 * ? Cierra el modal al hacer click fuera del modal si la opcion esta activada
	 * @public
	 * @param {MouseEvent} event
	 */
	public clickBackdrop(event: MouseEvent): void {
		const clickedElement = event.target as HTMLElement;
		const closestDiv = clickedElement.closest('div');
		const containerDiv = this.backdrop?.nativeElement;

		if (closestDiv !== containerDiv) return;
		this.close();
	}
}
