/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { NavigableMenu } from '@wordpress/components';
import {
	BlockNavigationDropdown,
	BlockToolbar,
	Inserter,
} from '@wordpress/block-editor';
import { PinnedItems } from '@wordpress/interface';
import { useViewportMatch } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SaveButton from '../save-button';
import UndoButton from './undo-redo/undo';
import RedoButton from './undo-redo/redo';
import { buildWidgetAreasPostId, KIND, POST_TYPE } from '../../store/utils';

const inserterToggleProps = { isPrimary: true };

function Header( { isCustomizer } ) {
	const isLargeViewport = useViewportMatch( 'medium' );
	const rootClientId = useSelect( ( select ) => {
		const { getBlockRootClientId, getBlockSelectionEnd } = select(
			'core/block-editor'
		);
		const selectedRootId = getBlockRootClientId( getBlockSelectionEnd() );
		if ( selectedRootId ) {
			return selectedRootId;
		}

		// Default to the first widget area
		const { getEntityRecord } = select( 'core' );
		const widgetAreasPost = getEntityRecord(
			KIND,
			POST_TYPE,
			buildWidgetAreasPostId()
		);
		if ( widgetAreasPost ) {
			return widgetAreasPost?.blocks[ 0 ]?.clientId;
		}
	}, [] );

	return (
		<>
			<div className="edit-widgets-header">
				<NavigableMenu>
					<Inserter
						position="bottom right"
						showInserterHelpPanel
						toggleProps={ inserterToggleProps }
						rootClientId={ rootClientId }
					/>
					<UndoButton />
					<RedoButton />
					<BlockNavigationDropdown />
				</NavigableMenu>
				{ ! isCustomizer && (
					<h1 className="edit-widgets-header__title">
						{ __( 'Block Areas' ) } { __( '(experimental)' ) }
					</h1>
				) }
				<div className="edit-widgets-header__actions">
					{ ! isCustomizer && <SaveButton /> }
					<PinnedItems.Slot
						scope={
							isCustomizer
								? 'core/edit-widgets-customizer'
								: 'core/edit-widgets'
						}
					/>
				</div>
			</div>
			{ ( ! isLargeViewport || isCustomizer ) && (
				<div className="edit-widgets-header__block-toolbar">
					<BlockToolbar hideDragHandle />
				</div>
			) }
		</>
	);
}

export default Header;
