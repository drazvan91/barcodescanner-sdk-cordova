//
//  SBSConstraints.m
//  ionic-4.13
//
//  Created by Moritz Hartmeier on 11/04/16.
//
//

#import "SBSConstraints.h"


/**
 * Constraints for the barcode picker consisting of margins, width and height. The getters
 * do not necessarily return the properties previously set but may return 0 for a margin if too
 * few margins were set or return null for width/height if too many margins were set.
 */
@implementation SBSConstraints

- (instancetype)init {
    if (self = [super init]) {
        
    }
    return self;
}

- (instancetype)initWithMargins:(CGRect)margins {
    if (self = [super init]) {
        self.leftMargin = [NSNumber numberWithInteger:margins.origin.x];
        self.topMargin = [NSNumber numberWithInteger:margins.origin.y];
        self.rightMargin = [NSNumber numberWithInteger:margins.size.width];
        self.bottomMargin = [NSNumber numberWithInteger:margins.size.height];
    }
    return self;
}

- (NSNumber *)leftMargin {
    if (!_leftMargin && (!_rightMargin || !_width)) return [NSNumber numberWithInteger:0];
    return _leftMargin;
}

- (NSNumber *)topMargin {
    if (!_topMargin && (!_bottomMargin || !_height)) return [NSNumber numberWithInteger:0];
    return _topMargin;
}

- (NSNumber *)rightMargin {
    if (!_rightMargin && !_width) return [NSNumber numberWithInteger:0];
    return _rightMargin;
}

- (NSNumber *)bottomMargin {
    if (!_bottomMargin && !_height) return [NSNumber numberWithInteger:0];
    return _bottomMargin;
}

- (NSNumber *)width {
    if (_leftMargin && _rightMargin) return nil;
    return _width;
}

- (NSNumber *)height {
    if (_topMargin && _bottomMargin) return nil;
    return _height;
}

@end
